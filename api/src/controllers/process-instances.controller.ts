import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import { ProcessInstances } from '../models';
import { ProcessInstancesRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import fs from 'fs';
import path from 'path';

export class ProcessInstancesController {
  constructor(
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
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

    return folderPath;
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @post('/process-instances')
  @response(200, {
    description: 'ProcessInstances model instance',
    content: { 'application/json': { schema: getModelSchemaRef(ProcessInstances) } },
  })
  async create(
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
  ): Promise<ProcessInstances> {
    const folderString = await this.createProcessFolder(processInstances.processInstanceName);
    return this.processInstancesRepository.create(processInstances);
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
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
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
    @param.filter(ProcessInstances) filter?: Filter<ProcessInstances>,
  ): Promise<ProcessInstances[]> {
    return this.processInstancesRepository.find({ ...filter, include: [{ relation: 'processes' }] });
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @patch('/process-instances')
  @response(200, {
    description: 'ProcessInstances PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstances, { partial: true }),
        },
      },
    })
    processInstances: ProcessInstances,
    @param.where(ProcessInstances) where?: Where<ProcessInstances>,
  ): Promise<Count> {
    return this.processInstancesRepository.updateAll(processInstances, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
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
    @param.path.number('id') id: number,
    @param.filter(ProcessInstances, { exclude: 'where' }) filter?: FilterExcludingWhere<ProcessInstances>
  ): Promise<ProcessInstances> {
    return this.processInstancesRepository.findById(id, { ...filter, include: [{ relation: 'processes' }] });
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @patch('/process-instances/{id}')
  @response(204, {
    description: 'ProcessInstances PATCH success',
  })
  async updateById(
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
    await this.processInstancesRepository.updateById(id, processInstances);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @put('/process-instances/{id}')
  @response(204, {
    description: 'ProcessInstances PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() processInstances: ProcessInstances,
  ): Promise<void> {
    await this.processInstancesRepository.replaceById(id, processInstances);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @del('/process-instances/{id}')
  @response(204, {
    description: 'ProcessInstances DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processInstancesRepository.deleteById(id);
  }
}
