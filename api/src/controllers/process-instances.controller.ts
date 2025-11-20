import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  relation,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { ProcessInstances, User } from '../models';
import { ProcessesRepository, ProcessInstanceDocumentsRepository, ProcessInstanceSecretsRepository, ProcessInstancesRepository, ProcessWorkflowOutputRepository, UserRepository, WorkflowInstancesRepository, WorkflowRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { randomBytes } from 'crypto';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';
import { JWTService } from '../services/jwt-service';
import axios from 'axios';

export class ProcessInstancesController {
  constructor(
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
    @repository(ProcessInstanceSecretsRepository)
    public processInstanceSecretsRepository: ProcessInstanceSecretsRepository,
    @repository(ProcessInstanceDocumentsRepository)
    public processInstanceDocumentsRepository: ProcessInstanceDocumentsRepository,
    @repository(ProcessWorkflowOutputRepository)
    public processWorkflowOutputRepository: ProcessWorkflowOutputRepository,
    @repository(WorkflowInstancesRepository)
    public workflowInstancesRepository: WorkflowInstancesRepository,
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.jwt.service')
    public jwtService: JWTService,
  ) { }

  slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // replace non-alphanumeric with hyphens
      .replace(/-+/g, '-')         // remove multiple hyphens
      .replace(/^-|-$/g, '');      // trim hyphens
  }

  async createProcessFolder(instanceName: string): Promise<string> {
    const slugifyName = this.slugify(instanceName);

    // Always resolve to absolute paths
    const sandboxRoot = path.resolve(__dirname, '../../.sandbox');
    const folderPath = path.resolve(sandboxRoot, slugifyName); // normalized, safe path

    console.log('slugify name:', slugifyName);

    // Validate: prevent directory traversal
    if (!folderPath.startsWith(sandboxRoot)) {
      throw new HttpErrors.BadRequest('Invalid process ID');
    }

    // Check if already exists
    if (fs.existsSync(folderPath)) {
      throw new HttpErrors.BadRequest(`Process instance with name "${instanceName}" already exists.`);
    }

    // Create the folder
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folderPath}`);

    return slugifyName;
  }

  async generateSecretKey(processInstanceId: number): Promise<{ secretKey: string; shortLivedToken: string }> {
    try {
      const processInstanceData = await this.processInstancesRepository.findById(processInstanceId);
      const generateRandomBytes = promisify(randomBytes);

      // Generate a 32-byte random key and convert it to hex (64 characters)
      const secretKey = (await generateRandomBytes(32)).toString('hex');

      await this.processInstanceSecretsRepository.create({ processInstancesId: processInstanceId, secretKey: secretKey });

      const processInstanceProfile = {
        processInstanceId: processInstanceId,
        processInstanceName: processInstanceData.processInstanceName,
        processInstanceSecretKey: secretKey,
        processId: processInstanceData.processesId
      };

      const shortLivedToken = await this.jwtService.generateShortLivedProcessInstanceToken(processInstanceProfile);

      return {
        secretKey,
        shortLivedToken
      };

    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @get('/regenrate-token/{processInstanceId}')
  async regenrateToken(
    @param.path.number('processInstanceId') id: number,
  ): Promise<string> {
    try {
      const processInstance = await this.processInstancesRepository.findById(id);

      if (!processInstance) {
        throw new HttpErrors.BadRequest('No process instance found');
      }

      const secretData = await this.processInstanceSecretsRepository.findOne({ where: { processInstancesId: processInstance.id } });

      if (!secretData) {
        throw new HttpErrors.BadRequest('Something went wrong');
      }

      const processInstanceProfile = {
        processInstanceId: id,
        processInstanceName: processInstance.processInstanceName,
        processInstanceSecretKey: secretData?.secretKey,
        processId: processInstance.processesId
      };

      const shortLivedToken = await this.jwtService.generateShortLivedProcessInstanceToken(processInstanceProfile);

      return shortLivedToken;
    } catch (error) {
      throw error;
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @post('/process-instances')
  @response(200, {
    description: 'ProcessInstances model instance',
    content: { 'application/json': { schema: getModelSchemaRef(ProcessInstances) } },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstances, {
            title: 'NewProcessInstances',
            exclude: ['id'],
          }),
        },
      },
    })
    processInstances: Omit<ProcessInstances, 'id'>,
  ): Promise<ProcessInstances | {}> {
    const processData: any = await this.processesRepository.findById(
      processInstances.processesId,
      {
        include: [{ relation: 'bluePrint' }],
      },
    );

    if (!processData) {
      throw new HttpErrors.BadRequest('Process not found.');
    }

    if (!processData.bluePrint) {
      throw new HttpErrors.NotFound(
        `Blueprint is missing for process ${processData.name}`,
      );
    }

    const ingestionType = processData.bluePrint?.bluePrint?.find(
      (node: any) => node.nodeName === 'Ingestion',
    );

    if (!ingestionType) {
      throw new HttpErrors.BadRequest(
        'Blueprint is missing the "Ingestion" node.',
      );
    }

    const newProcessInstanceData: any = {
      ...processInstances,
      userId: currentUser.id
    };

    if (
      ingestionType?.component?.channelType === 'ui' ||
      ingestionType?.component?.channelType === 'api'
    ) {
      const folderString = await this.createProcessFolder(
        processInstances.processInstanceName,
      );
      newProcessInstanceData.processInstanceFolderName = folderString;
    }

    const createdProcessInstance = await this.processInstancesRepository.create(newProcessInstanceData);

    const processInstanceData = await this.processInstancesRepository.findById(
      createdProcessInstance.id,
      {
        include: [
          {
            relation: 'processes',
            scope: {
              include: [{ relation: 'bluePrint' }],
            },
          },
        ],
      },
    );

    if (ingestionType?.component?.channelType === 'api' && processInstanceData.id) {
      const response = await this.generateSecretKey(processInstanceData.id);

      return {
        ...processInstanceData,
        ...response
      }
    }

    return processInstanceData;
  }

  @get('/process-instances/count')
  @response(200, {
    description: 'ProcessInstances model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(ProcessInstances) where?: Where<ProcessInstances>,
  ): Promise<Count> {
    return this.processInstancesRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @get('/process-instances')
  @response(200, {
    description: 'Array of ProcessInstances model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstances, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(ProcessInstances) filter?: Filter<ProcessInstances>,
  ): Promise<ProcessInstances[]> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (user && user.permissions.includes('super_admin')) {
        return this.processInstancesRepository.find(
          {
            ...filter,
            where: {
              ...filter?.where,
              isDeleted: false
            },
            include: [
              { relation: 'processes' }
            ]
          }
        );
      }
      return this.processInstancesRepository.find(
        {
          ...filter,
          where: {
            ...filter?.where,
            and: [
              { userId: user.id },
              { isDeleted: false }
            ]
          },
          include: [{ relation: 'processes' }]
        }
      );

    } catch (error) {
      console.log('error while process instance', error);
      throw error;
    }
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  // })
  // @patch('/process-instances')
  // @response(200, {
  //   description: 'ProcessInstances PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(ProcessInstances, { partial: true }),
  //       },
  //     },
  //   })
  //   processInstances: ProcessInstances,
  //   @param.where(ProcessInstances) where?: Where<ProcessInstances>,
  // ): Promise<Count> {
  //   return this.processInstancesRepository.updateAll(processInstances, where);
  // }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @get('/process-instances/{id}')
  @response(200, {
    description: 'ProcessInstances model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessInstances, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @param.filter(ProcessInstances, { exclude: 'where' }) filter?: FilterExcludingWhere<ProcessInstances>
  ): Promise<ProcessInstances> {
    const user = await this.userRepository.findById(currentUser.id);
    const processInstance: any = await this.processInstancesRepository.findById(
      id, {
      ...filter,
      include: [
        {
          relation: 'processes',
          scope: {
            include: [
              { relation: 'bluePrint' },
            ]
          },
        },
      ]
    }
    );

    if (!user || (user && (!user.permissions.includes('super_admin') && user.id !== processInstance.userId))) {
      throw new HttpErrors.Unauthorized('Unauthorized success');
    }

    if (processInstance) {
      const processes = processInstance?.processes;
      const bluePrint = processes?.bluePrint;
      const ingestionNode = bluePrint?.bluePrint?.find((node: any) => node.nodeName === 'Ingestion');
      const ingestionType = ingestionNode?.component?.channelType === 'api';

      if (ingestionType) {
        const secretData = await this.processInstanceSecretsRepository.findOne({ where: { processInstancesId: processInstance.id } });

        if (secretData) {
          return {
            ...processInstance,
            secretKey: secretData.secretKey
          }
        }
      }
    }

    return processInstance;
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @patch('/process-instances/{id}')
  @response(204, {
    description: 'ProcessInstances PATCH success',
  })
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstances, { partial: true }),
        },
      },
    })
    processInstances: ProcessInstances,
  ): Promise<void> {
    const user = await this.userRepository.findById(currentUser.id);
    const processInstance = await this.processInstancesRepository.findById(id);

    if (user && (user.permissions.includes('super_admin') || processInstance.userId === user.id)) {
      await this.processInstancesRepository.updateById(id, processInstances);
      return;
    }

    throw new HttpErrors.Unauthorized('Unauthorized access');
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  // })
  // @put('/process-instances/{id}')
  // @response(204, {
  //   description: 'ProcessInstances PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() processInstances: ProcessInstances,
  // ): Promise<void> {
  //   await this.processInstancesRepository.replaceById(id, processInstances);
  // }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @del('/process-instances/{id}')
  @response(204, {
    description: 'ProcessInstances DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const processInstance = await this.processInstancesRepository.findById(id);
    await this.processInstancesRepository.deleteById(id);

    if (processInstance.processInstanceFolderName) {
      // Build the folder path: .sandbox/<processinstanceFolder>
      const folderPath = path.join(__dirname, '../../.sandbox', `${processInstance.processInstanceFolderName}`);

      // Delete the folder if it exists
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`Deleted folder: ${folderPath}`);
      } else {
        console.warn(`Folder not found: ${folderPath}`);
      }
    }
  }

  // delivering data to workflow...
  // no authentication as on airflow side we dont have access token...
  @post('/process-instances/deliver-to-workflow')
  async deliverToWorkflow(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              processInstanceId: {
                type: 'number',
              },
              workflowId: {
                type: 'string'
              }
            },
            required: ['processInstanceId', 'workflowId'],
          }
        }
      }
    })
    requestBody: {
      processInstanceId: number;
      workflowId: string;
    }
  ): Promise<{ success: boolean, message: string }> {
    try {
      const { processInstanceId, workflowId } = requestBody;

      const processInstance: any = await this.processInstanceDocumentsRepository.findOne({
        where: {
          processInstancesId: processInstanceId
        },
        include: [
          { relation: 'processInstances' },
        ]
      });

      if (!processInstance) {
        throw new HttpErrors.BadRequest('Extracted data for process instance not found');
      }

      const processInstanceDocuments: any = await this.processInstanceDocumentsRepository.find({ where: { processInstancesId: processInstanceId } });

      // Check if we found any document
      if (!processInstanceDocuments || processInstanceDocuments.length === 0) {
        throw new HttpErrors.NotFound('No documents found for this process instance');
      }

      // Extract all fields from all documents
      const allExtractedFields = processInstanceDocuments
        .flatMap((doc : any) => doc.extractedFields || []);

      // Ensure fields exist
      if (!allExtractedFields || allExtractedFields.length === 0) {
        throw new HttpErrors.NotFound('No extracted fields found');
      }

      const response: any = await axios.post(`${process.env.REACT_APP_WORKFLOW_HOST_API}/workflow/process`, {
        workflowId: workflowId,
        processInstanceName: processInstance?.processInstances?.processInstanceName
      });

      const workflowBody = Object.fromEntries(
        allExtractedFields.map((f: any) => [f.fieldName, f.fieldValue])
      );

      if (response && response?.data?.success) {
        const triggerWebhook = await axios.post(`${process.env.REACT_APP_WORKFLOW_HOST_API}/workflow/webhook/${response?.data?.data?.workflowInstanceId}/${response?.data?.data?.webhookId}`, {
          ...workflowBody
        });

        return {
          success: true,
          message: 'Delivered to workflow'
        }
      }

      throw HttpErrors.BadRequest('Something went wrong');
    } catch (error) {
      throw error;
    }
  }
}
