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
import {AiModel} from '../models';
import {AiModelRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class AiModelController {
  constructor(
    @repository(AiModelRepository)
    public aiModelRepository : AiModelRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @post('/ai-models')
  @response(200, {
    description: 'AiModel model instance',
    content: {'application/json': {schema: getModelSchemaRef(AiModel)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AiModel, {
            title: 'NewAiModel',
            exclude: ['id'],
          }),
        },
      },
    })
    aiModel: Omit<AiModel, 'id'>,
  ): Promise<AiModel> {
    return this.aiModelRepository.create(aiModel);
  }

  @get('/ai-models/count')
  @response(200, {
    description: 'AiModel model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AiModel) where?: Where<AiModel>,
  ): Promise<Count> {
    return this.aiModelRepository.count(where);
  }

  @get('/ai-models')
  @response(200, {
    description: 'Array of AiModel model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AiModel, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AiModel) filter?: Filter<AiModel>,
  ): Promise<AiModel[]> {
    return this.aiModelRepository.find(filter);
  }

  @patch('/ai-models')
  @response(200, {
    description: 'AiModel PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AiModel, {partial: true}),
        },
      },
    })
    aiModel: AiModel,
    @param.where(AiModel) where?: Where<AiModel>,
  ): Promise<Count> {
    return this.aiModelRepository.updateAll(aiModel, where);
  }

  @get('/ai-models/{id}')
  @response(200, {
    description: 'AiModel model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AiModel, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(AiModel, {exclude: 'where'}) filter?: FilterExcludingWhere<AiModel>
  ): Promise<AiModel> {
    return this.aiModelRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/ai-models/{id}')
  @response(204, {
    description: 'AiModel PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AiModel, {partial: true}),
        },
      },
    })
    aiModel: AiModel,
  ): Promise<void> {
    await this.aiModelRepository.updateById(id, aiModel);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @put('/ai-models/{id}')
  @response(204, {
    description: 'AiModel PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() aiModel: AiModel,
  ): Promise<void> {
    await this.aiModelRepository.replaceById(id, aiModel);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @del('/ai-models/{id}')
  @response(204, {
    description: 'AiModel DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.aiModelRepository.deleteById(id);
  }
}
