import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProcessInstances,
  User,
} from '../models';
import {ProcessInstancesRepository} from '../repositories';

export class ProcessInstancesUserController {
  constructor(
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
  ) { }

  @get('/process-instances/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to ProcessInstances',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof ProcessInstances.prototype.id,
  ): Promise<User> {
    return this.processInstancesRepository.user(id);
  }
}
