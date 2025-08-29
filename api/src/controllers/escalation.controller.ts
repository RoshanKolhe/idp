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
import {Escalation} from '../models';
import {EscalationRepository} from '../repositories';

export class EscalationController {
  constructor(
    @repository(EscalationRepository)
    public escalationRepository : EscalationRepository,
  ) {}

  @post('/escalations')
  @response(200, {
    description: 'Escalation model instance',
    content: {'application/json': {schema: getModelSchemaRef(Escalation)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Escalation, {
            title: 'NewEscalation',
            exclude: ['id'],
          }),
        },
      },
    })
    escalation: Omit<Escalation, 'id'>,
  ): Promise<Escalation> {
    return this.escalationRepository.create(escalation);
  }

  @get('/escalations/count')
  @response(200, {
    description: 'Escalation model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Escalation) where?: Where<Escalation>,
  ): Promise<Count> {
    return this.escalationRepository.count(where);
  }

  @get('/escalations')
  @response(200, {
    description: 'Array of Escalation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Escalation, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Escalation) filter?: Filter<Escalation>,
  ): Promise<Escalation[]> {
    const escalations = await this.escalationRepository.find({...filter, include: [{relation: 'levels', scope: {include: [{relation: 'members'}]}}]});
    return escalations;
  }

  @patch('/escalations')
  @response(200, {
    description: 'Escalation PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Escalation, {partial: true}),
        },
      },
    })
    escalation: Escalation,
    @param.where(Escalation) where?: Where<Escalation>,
  ): Promise<Count> {
    return this.escalationRepository.updateAll(escalation, where);
  }

  @get('/escalations/{id}')
  @response(200, {
    description: 'Escalation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Escalation, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Escalation, {exclude: 'where'}) filter?: FilterExcludingWhere<Escalation>
  ): Promise<Escalation> {
    return this.escalationRepository.findById(id, filter);
  }

  @patch('/escalations/{id}')
  @response(204, {
    description: 'Escalation PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Escalation, {partial: true}),
        },
      },
    })
    escalation: Escalation,
  ): Promise<void> {
    await this.escalationRepository.updateById(id, escalation);
  }

  @put('/escalations/{id}')
  @response(204, {
    description: 'Escalation PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() escalation: Escalation,
  ): Promise<void> {
    await this.escalationRepository.replaceById(id, escalation);
  }

  @del('/escalations/{id}')
  @response(204, {
    description: 'Escalation DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.escalationRepository.deleteById(id);
  }
}
