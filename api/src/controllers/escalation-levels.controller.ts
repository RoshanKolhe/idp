import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Escalation,
  Levels,
} from '../models';
import {EscalationRepository} from '../repositories';

export class EscalationLevelsController {
  constructor(
    @repository(EscalationRepository) protected escalationRepository: EscalationRepository,
  ) { }

  @get('/escalations/{id}/levels', {
    responses: {
      '200': {
        description: 'Array of Escalation has many Levels',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Levels)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Levels>,
  ): Promise<Levels[]> {
    return this.escalationRepository.levels(id).find(filter);
  }

  @post('/escalations/{id}/levels', {
    responses: {
      '200': {
        description: 'Escalation model instance',
        content: {'application/json': {schema: getModelSchemaRef(Levels)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Escalation.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Levels, {
            title: 'NewLevelsInEscalation',
            exclude: ['id'],
            optional: ['escalationId']
          }),
        },
      },
    }) levels: Omit<Levels, 'id'>,
  ): Promise<Levels> {
    return this.escalationRepository.levels(id).create(levels);
  }

  @patch('/escalations/{id}/levels', {
    responses: {
      '200': {
        description: 'Escalation.Levels PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Levels, {partial: true}),
        },
      },
    })
    levels: Partial<Levels>,
    @param.query.object('where', getWhereSchemaFor(Levels)) where?: Where<Levels>,
  ): Promise<Count> {
    return this.escalationRepository.levels(id).patch(levels, where);
  }

  @del('/escalations/{id}/levels', {
    responses: {
      '200': {
        description: 'Escalation.Levels DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Levels)) where?: Where<Levels>,
  ): Promise<Count> {
    return this.escalationRepository.levels(id).delete(where);
  }
}
