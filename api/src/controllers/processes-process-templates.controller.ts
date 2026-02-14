import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Processes,
  ProcessTemplates,
} from '../models';
import {ProcessesRepository} from '../repositories';

export class ProcessesProcessTemplatesController {
  constructor(
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
  ) { }

  @get('/processes/{id}/process-templates', {
    responses: {
      '200': {
        description: 'ProcessTemplates belonging to Processes',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ProcessTemplates),
          },
        },
      },
    },
  })
  async getProcessTemplates(
    @param.path.number('id') id: typeof Processes.prototype.id,
  ): Promise<ProcessTemplates> {
    return this.processesRepository.processTemplates(id);
  }
}
