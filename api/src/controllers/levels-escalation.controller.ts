import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Levels,
  Escalation,
} from '../models';
import {LevelsRepository} from '../repositories';

export class LevelsEscalationController {
  constructor(
    @repository(LevelsRepository)
    public levelsRepository: LevelsRepository,
  ) { }

  @get('/levels/{id}/escalation', {
    responses: {
      '200': {
        description: 'Escalation belonging to Levels',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Escalation),
          },
        },
      },
    },
  })
  async getEscalation(
    @param.path.number('id') id: typeof Levels.prototype.id,
  ): Promise<Escalation> {
    return this.levelsRepository.escalation(id);
  }
}
