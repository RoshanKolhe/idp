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
import { ProcessTemplates } from '../models';
import { ProcessTemplatesRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class ProcessTemplateController {
  constructor(
    @repository(ProcessTemplatesRepository)
    public processTemplatesRepository: ProcessTemplatesRepository,
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.SUPER_ADMIN] }
  })
  @post('/process-templates')
  @response(200, {
    description: 'ProcessTemplates model instance',
    content: { 'application/json': { schema: getModelSchemaRef(ProcessTemplates) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTemplates, {
            title: 'NewProcessTemplates',
            exclude: ['id'],
          }),
        },
      },
    })
    processTemplates: Omit<ProcessTemplates, 'id'>,
  ): Promise<ProcessTemplates> {
    return this.processTemplatesRepository.create(processTemplates);
  }

  @get('/process-templates/count')
  @response(200, {
    description: 'ProcessTemplates model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(ProcessTemplates) where?: Where<ProcessTemplates>,
  ): Promise<Count> {
    return this.processTemplatesRepository.count({
      and: [{isDeleted: false}, where ?? {}],
    });
  }

  @get('/process-templates')
  @response(200, {
    description: 'Array of ProcessTemplates model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessTemplates, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessTemplates) filter?: Filter<ProcessTemplates>,
  ): Promise<ProcessTemplates[]> {
    return this.processTemplatesRepository.find({
      ...filter,
      where: {
        and: [{isDeleted: false}, filter?.where ?? {}],
      },
      include: [{relation: 'processes'}],
    });
  }

  @patch('/process-templates')
  @response(200, {
    description: 'ProcessTemplates PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTemplates, { partial: true }),
        },
      },
    })
    processTemplates: ProcessTemplates,
    @param.where(ProcessTemplates) where?: Where<ProcessTemplates>,
  ): Promise<Count> {
    return this.processTemplatesRepository.updateAll(processTemplates, where);
  }

  @get('/process-templates/{id}')
  @response(200, {
    description: 'ProcessTemplates model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessTemplates, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcessTemplates, { exclude: 'where' }) filter?: FilterExcludingWhere<ProcessTemplates>
  ): Promise<ProcessTemplates> {
    const processTemplate = await this.processTemplatesRepository.findById(id, {
      ...filter,
      include: [{relation: 'processes'}],
    });
    if (processTemplate.isDeleted) throw new HttpErrors.NotFound('ProcessTemplate not found');
    return processTemplate;
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.SUPER_ADMIN] }
  })
  @patch('/process-templates/{id}')
  @response(204, {
    description: 'ProcessTemplates PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessTemplates, { partial: true }),
        },
      },
    })
    processTemplates: ProcessTemplates,
  ): Promise<void> {
    await this.processTemplatesRepository.updateById(id, processTemplates);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.SUPER_ADMIN] }
  // })
  // @put('/process-templates/{id}')
  // @response(204, {
  //   description: 'ProcessTemplates PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() processTemplates: ProcessTemplates,
  // ): Promise<void> {
  //   await this.processTemplatesRepository.replaceById(id, processTemplates);
  // }

  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.SUPER_ADMIN]},
  })
  @del('/process-templates/{id}')
  @response(204, {
    description: 'ProcessTemplates DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processTemplatesRepository.updateById(id, {isDeleted: true, deletedAt: new Date()});
  }
}
