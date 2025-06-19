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
} from '@loopback/rest';
import {ProcessInstanceDocuments} from '../models';
import {ProcessInstanceDocumentsRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class ProcessInstanceDocumentsController {
  constructor(
    @repository(ProcessInstanceDocumentsRepository)
    public processInstanceDocumentsRepository : ProcessInstanceDocumentsRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @post('/process-instance-documents')
  @response(200, {
    description: 'ProcessInstanceDocuments model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProcessInstanceDocuments)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceDocuments, {
            title: 'NewProcessInstanceDocuments',
            exclude: ['id'],
          }),
        },
      },
    })
    processInstanceDocuments: Omit<ProcessInstanceDocuments, 'id'>,
  ): Promise<ProcessInstanceDocuments> {
    return this.processInstanceDocumentsRepository.create(processInstanceDocuments);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @get('/process-instance-documents/count')
  @response(200, {
    description: 'ProcessInstanceDocuments model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProcessInstanceDocuments) where?: Where<ProcessInstanceDocuments>,
  ): Promise<Count> {
    return this.processInstanceDocumentsRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @get('/process-instance-documents')
  @response(200, {
    description: 'Array of ProcessInstanceDocuments model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstanceDocuments, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessInstanceDocuments) filter?: Filter<ProcessInstanceDocuments>,
  ): Promise<ProcessInstanceDocuments[]> {
    return this.processInstanceDocumentsRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/process-instance-documents')
  @response(200, {
    description: 'ProcessInstanceDocuments PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceDocuments, {partial: true}),
        },
      },
    })
    processInstanceDocuments: ProcessInstanceDocuments,
    @param.where(ProcessInstanceDocuments) where?: Where<ProcessInstanceDocuments>,
  ): Promise<Count> {
    return this.processInstanceDocumentsRepository.updateAll(processInstanceDocuments, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @get('/process-instance-documents/{id}')
  @response(200, {
    description: 'ProcessInstanceDocuments model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessInstanceDocuments, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcessInstanceDocuments, {exclude: 'where'}) filter?: FilterExcludingWhere<ProcessInstanceDocuments>
  ): Promise<ProcessInstanceDocuments> {
    return this.processInstanceDocumentsRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/process-instance-documents/{id}')
  @response(204, {
    description: 'ProcessInstanceDocuments PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceDocuments, {partial: true}),
        },
      },
    })
    processInstanceDocuments: ProcessInstanceDocuments,
  ): Promise<void> {
    await this.processInstanceDocumentsRepository.updateById(id, processInstanceDocuments);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @put('/process-instance-documents/{id}')
  @response(204, {
    description: 'ProcessInstanceDocuments PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() processInstanceDocuments: ProcessInstanceDocuments,
  ): Promise<void> {
    await this.processInstanceDocumentsRepository.replaceById(id, processInstanceDocuments);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @del('/process-instance-documents/{id}')
  @response(204, {
    description: 'ProcessInstanceDocuments DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processInstanceDocumentsRepository.deleteById(id);
  }

  // get process instance documents with process instance id
  @authenticate({
    strategy : 'jwt',
    options : {
      required : [
        PermissionKeys.ADMIN,
        PermissionKeys.SUPER_ADMIN
      ]
    }
  })
  @get('/process-instance-documents/by-process-instance/{id}')
  @response(200, {
    description: 'Array of ProcessInstanceDocuments model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstanceDocuments, {includeRelations: true}),
        },
      },
    },
  })
  async fetchDocumentsWithProcessInstance(
    @param.path.number('id') id: number,
  ): Promise<{
    success: boolean,
    message: string,
    data: ProcessInstanceDocuments[] 
  }>{
    try{
      const processInstanceDocuments = await this.processInstanceDocumentsRepository.find({
        where : {
          processInstancesId : id
        },
        include : [
          {relation : 'processInstances'},
          {relation : 'documentType'}
        ]
      })
      return{
        success: true,
        message: 'Process Instance Documents',
        data: processInstanceDocuments
      }
    }catch(error){
      throw error;
    }
  }
}
