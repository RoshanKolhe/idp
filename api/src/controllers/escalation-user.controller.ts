import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Escalation,
  User,
} from '../models';
import {EscalationRepository} from '../repositories';

export class EscalationUserController {
  constructor(
    @repository(EscalationRepository)
    public escalationRepository: EscalationRepository,
  ) { }

  @get('/escalations/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Escalation',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Escalation.prototype.id,
  ): Promise<User> {
    return this.escalationRepository.user(id);
  }
}
