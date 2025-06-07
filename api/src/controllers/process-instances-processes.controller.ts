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
  Processes,
} from '../models';
import {ProcessInstancesRepository} from '../repositories';

export class ProcessInstancesProcessesController {
  constructor(
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
  ) { }

  @get('/process-instances/{id}/processes', {
    responses: {
      '200': {
        description: 'Processes belonging to ProcessInstances',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Processes),
          },
        },
      },
    },
  })
  async getProcesses(
    @param.path.number('id') id: typeof ProcessInstances.prototype.id,
  ): Promise<Processes> {
    return this.processInstancesRepository.processes(id);
  }
}
