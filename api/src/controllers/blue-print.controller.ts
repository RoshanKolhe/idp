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
import {BluePrint} from '../models';
import {BluePrintRepository, ProcessesRepository} from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class BluePrintController {
  constructor(
    @repository(BluePrintRepository)
    public bluePrintRepository : BluePrintRepository,
    @repository(ProcessesRepository)
    public processesRepository : ProcessesRepository
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @post('/blue-prints')
  @response(200, {
    description: 'BluePrint model instance',
    content: {'application/json': {schema: getModelSchemaRef(BluePrint)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, {
            title: 'NewBluePrint',
            exclude: ['id'],
          }),
        },
      },
    })
    bluePrint: Omit<BluePrint, 'id'>,
  ): Promise<BluePrint> {
    const bluePrintData = await this.bluePrintRepository.create(bluePrint);

    if(bluePrintData && bluePrintData.processesId){
      await this.processesRepository.updateById(bluePrintData.processesId, {bluePrintId : bluePrintData.id});
    }

    return bluePrintData;
  }

  @get('/blue-prints/count')
  @response(200, {
    description: 'BluePrint model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(BluePrint) where?: Where<BluePrint>,
  ): Promise<Count> {
    return this.bluePrintRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @get('/blue-prints')
  @response(200, {
    description: 'Array of BluePrint model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BluePrint, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(BluePrint) filter?: Filter<BluePrint>,
  ): Promise<BluePrint[]> {
    return this.bluePrintRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/blue-prints')
  @response(200, {
    description: 'BluePrint PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, {partial: true}),
        },
      },
    })
    bluePrint: BluePrint,
    @param.where(BluePrint) where?: Where<BluePrint>,
  ): Promise<Count> {
    return this.bluePrintRepository.updateAll(bluePrint, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @get('/blue-prints/{id}')
  @response(200, {
    description: 'BluePrint model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BluePrint, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BluePrint, {exclude: 'where'}) filter?: FilterExcludingWhere<BluePrint>
  ): Promise<BluePrint> {
    return this.bluePrintRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @patch('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, {partial: true}),
        },
      },
    })
    bluePrint: BluePrint,
  ): Promise<void> {
    await this.bluePrintRepository.updateById(id, bluePrint);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @put('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() bluePrint: BluePrint,
  ): Promise<void> {
    await this.bluePrintRepository.replaceById(id, bluePrint);
  }

  @authenticate({
    strategy: 'jwt',
    options: {required : [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN]}
  })
  @del('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bluePrintRepository.deleteById(id);
  }
}
