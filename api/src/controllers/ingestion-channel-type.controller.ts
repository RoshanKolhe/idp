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
import {IngestionChannelType} from '../models';
import {IngestionChannelTypeRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class IngestionChannelTypeController {
  constructor(
    @repository(IngestionChannelTypeRepository)
    public ingestionChannelTypeRepository : IngestionChannelTypeRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @post('/ingestion-channel-types')
  @response(200, {
    description: 'IngestionChannelType model instance',
    content: {'application/json': {schema: getModelSchemaRef(IngestionChannelType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IngestionChannelType, {
            title: 'NewIngestionChannelType',
            exclude: ['id'],
          }),
        },
      },
    })
    ingestionChannelType: Omit<IngestionChannelType, 'id'>,
  ): Promise<IngestionChannelType> {
    return this.ingestionChannelTypeRepository.create(ingestionChannelType);
  }

  @get('/ingestion-channel-types/count')
  @response(200, {
    description: 'IngestionChannelType model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(IngestionChannelType) where?: Where<IngestionChannelType>,
  ): Promise<Count> {
    return this.ingestionChannelTypeRepository.count(where);
  }

  @get('/ingestion-channel-types')
  @response(200, {
    description: 'Array of IngestionChannelType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(IngestionChannelType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(IngestionChannelType) filter?: Filter<IngestionChannelType>,
  ): Promise<IngestionChannelType[]> {
    return this.ingestionChannelTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/ingestion-channel-types')
  @response(200, {
    description: 'IngestionChannelType PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IngestionChannelType, {partial: true}),
        },
      },
    })
    ingestionChannelType: IngestionChannelType,
    @param.where(IngestionChannelType) where?: Where<IngestionChannelType>,
  ): Promise<Count> {
    return this.ingestionChannelTypeRepository.updateAll(ingestionChannelType, where);
  }

  @get('/ingestion-channel-types/{id}')
  @response(200, {
    description: 'IngestionChannelType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(IngestionChannelType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(IngestionChannelType, {exclude: 'where'}) filter?: FilterExcludingWhere<IngestionChannelType>
  ): Promise<IngestionChannelType> {
    return this.ingestionChannelTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/ingestion-channel-types/{id}')
  @response(204, {
    description: 'IngestionChannelType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(IngestionChannelType, {partial: true}),
        },
      },
    })
    ingestionChannelType: IngestionChannelType,
  ): Promise<void> {
    await this.ingestionChannelTypeRepository.updateById(id, ingestionChannelType);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @put('/ingestion-channel-types/{id}')
  @response(204, {
    description: 'IngestionChannelType PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() ingestionChannelType: IngestionChannelType,
  ): Promise<void> {
    await this.ingestionChannelTypeRepository.replaceById(id, ingestionChannelType);
  }
  
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @del('/ingestion-channel-types/{id}')
  @response(204, {
    description: 'IngestionChannelType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ingestionChannelTypeRepository.deleteById(id);
  }
}
