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
import {MailServer} from '../models';
import {MailServerRepository} from '../repositories';

export class MailServerController {
  constructor(
    @repository(MailServerRepository)
    public mailServerRepository : MailServerRepository,
  ) {}

  @post('/mail-servers')
  @response(200, {
    description: 'MailServer model instance',
    content: {'application/json': {schema: getModelSchemaRef(MailServer)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailServer, {
            title: 'NewMailServer',
            exclude: ['id'],
          }),
        },
      },
    })
    mailServer: Omit<MailServer, 'id'>,
  ): Promise<MailServer> {
    return this.mailServerRepository.create(mailServer);
  }

  @get('/mail-servers/count')
  @response(200, {
    description: 'MailServer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(MailServer) where?: Where<MailServer>,
  ): Promise<Count> {
    return this.mailServerRepository.count(where);
  }

  @get('/mail-servers')
  @response(200, {
    description: 'Array of MailServer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(MailServer, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(MailServer) filter?: Filter<MailServer>,
  ): Promise<MailServer[]> {
    return this.mailServerRepository.find(filter);
  }

  @patch('/mail-servers')
  @response(200, {
    description: 'MailServer PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailServer, {partial: true}),
        },
      },
    })
    mailServer: MailServer,
    @param.where(MailServer) where?: Where<MailServer>,
  ): Promise<Count> {
    return this.mailServerRepository.updateAll(mailServer, where);
  }

  @get('/mail-servers/{id}')
  @response(200, {
    description: 'MailServer model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(MailServer, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(MailServer, {exclude: 'where'}) filter?: FilterExcludingWhere<MailServer>
  ): Promise<MailServer> {
    return this.mailServerRepository.findById(id, filter);
  }

  @patch('/mail-servers/{id}')
  @response(204, {
    description: 'MailServer PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MailServer, {partial: true}),
        },
      },
    })
    mailServer: MailServer,
  ): Promise<void> {
    await this.mailServerRepository.updateById(id, mailServer);
  }

  @put('/mail-servers/{id}')
  @response(204, {
    description: 'MailServer PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() mailServer: MailServer,
  ): Promise<void> {
    await this.mailServerRepository.replaceById(id, mailServer);
  }

  @del('/mail-servers/{id}')
  @response(204, {
    description: 'MailServer DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.mailServerRepository.deleteById(id);
  }
}
