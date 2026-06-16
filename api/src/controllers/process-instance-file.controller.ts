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
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { ProcessInstanceFile } from '../models';
import { ProcessInstanceFileRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class ProcessInstanceFileController {
  constructor(
    @repository(ProcessInstanceFileRepository)
    public processInstanceFileRepository: ProcessInstanceFileRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @post('/process-instance-files')
  @response(200, {
    description: 'ProcessInstanceFile model instance',
    content: { 'application/json': { schema: getModelSchemaRef(ProcessInstanceFile) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceFile, {
            title: 'NewProcessInstanceFile',
            exclude: ['id'],
          }),
        },
      },
    })
    processInstanceFile: Omit<ProcessInstanceFile, 'id'>,
  ): Promise<ProcessInstanceFile> {
    return this.processInstanceFileRepository.create(processInstanceFile);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-files/count')
  @response(200, {
    description: 'ProcessInstanceFile model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(ProcessInstanceFile) where?: Where<ProcessInstanceFile>,
  ): Promise<Count> {
    return this.processInstanceFileRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-files')
  @response(200, {
    description: 'Array of ProcessInstanceFile model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstanceFile, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessInstanceFile) filter?: Filter<ProcessInstanceFile>,
  ): Promise<ProcessInstanceFile[]> {
    return this.processInstanceFileRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-files/{id}')
  @response(200, {
    description: 'ProcessInstanceFile model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessInstanceFile, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcessInstanceFile, { exclude: 'where' })
    filter?: FilterExcludingWhere<ProcessInstanceFile>,
  ): Promise<ProcessInstanceFile> {
    return this.processInstanceFileRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @patch('/process-instance-files/{id}')
  @response(200, {
    description: 'ProcessInstanceFile PATCH success',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceFile, { partial: true }),
        },
      },
    })
    processInstanceFile: Partial<ProcessInstanceFile>,
  ): Promise<{ success: boolean; message: string; data: ProcessInstanceFile }> {
    await this.processInstanceFileRepository.updateById(id, processInstanceFile);
    const updatedData = await this.processInstanceFileRepository.findById(id);
    return { success: true, message: 'Update success', data: updatedData };
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @del('/process-instance-files/{id}')
  @response(204, {
    description: 'ProcessInstanceFile DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processInstanceFileRepository.deleteById(id);
  }

  // Get all files for a process instance
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-files/by-instance/{processInstanceId}')
  @response(200, {
    description: 'Array of ProcessInstanceFile for a given process instance',
    content: {
      'application/json': {
        schema: { type: 'array', items: getModelSchemaRef(ProcessInstanceFile, { includeRelations: true }) },
      },
    },
  })
  async findByProcessInstance(
    @param.path.number('processInstanceId') processInstanceId: number,
  ): Promise<{ success: boolean; message: string; data: ProcessInstanceFile[] }> {
    const files = await this.processInstanceFileRepository.find({
      where: { processInstancesId: processInstanceId, isDeleted: false },
      include: [{ relation: 'documentType' }, { relation: 'processInstances' }],
    });
    return { success: true, message: 'Process instance files', data: files };
  }

  // Check if a document already exists by name for a process instance (used by classify DAG for dedup)
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-files/check-exists')
  @response(200, {
    description: 'Check if document exists by name for a process instance',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async checkExists(
    @param.query.number('processInstanceId') processInstanceId: number,
    @param.query.string('documentName') documentName: string,
  ): Promise<{ exists: boolean; file: ProcessInstanceFile | null }> {
    if (!processInstanceId || !documentName) {
      throw new HttpErrors.BadRequest('processInstanceId and documentName are required');
    }
    const existing = await this.processInstanceFileRepository.findOne({
      where: {
        processInstancesId: processInstanceId,
        documentName,
        isDeleted: false,
      },
    });
    return { exists: !!existing, file: existing ?? null };
  }
}
