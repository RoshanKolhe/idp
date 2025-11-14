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
import {ProcessType} from '../models';
import {ProcessTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {PermissionKeys} from '../authorization/permission-keys';

export class ProcessTypeController {
  constructor(
    @repository(ProcessTypeRepository)
    public processTypeRepository: ProcessTypeRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.SUPER_ADMIN],
    },
  })
  @post('/process-types')
  @response(200, {
    description: 'ProcessType model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProcessType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessType, {
            title: 'NewProcessType',
            exclude: ['id'],
          }),
        },
      },
    })
    processType: Omit<ProcessType, 'id'>,
  ): Promise<ProcessType> {
    return this.processTypeRepository.create(processType);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: {
  //     required: [PermissionKeys.SUPER_ADMIN],
  //   },
  // })
  @get('/process-types')
  @response(200, {
    description: 'Array of ProcessType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessType) filter?: Filter<ProcessType>,
  ): Promise<ProcessType[]> {
    return this.processTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.SUPER_ADMIN],
    },
  })
  @get('/process-types/{id}')
  @response(200, {
    description: 'ProcessType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcessType, {exclude: 'where'})
    filter?: FilterExcludingWhere<ProcessType>,
  ): Promise<ProcessType> {
    return this.processTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.SUPER_ADMIN],
    },
  })
  @patch('/process-types/{id}')
  @response(204, {
    description: 'ProcessType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessType, {partial: true}),
        },
      },
    })
    processType: ProcessType,
  ): Promise<void> {
    await this.processTypeRepository.updateById(id, processType);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.SUPER_ADMIN],
    },
  })
  @del('/process-types/{id}')
  @response(204, {
    description: 'ProcessType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processTypeRepository.deleteById(id);
  }
}
