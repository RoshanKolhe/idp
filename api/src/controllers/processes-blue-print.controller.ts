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
  BluePrint,
} from '../models';
import {ProcessesRepository} from '../repositories';

export class ProcessesBluePrintController {
  constructor(
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
  ) { }

  @get('/processes/{id}/blue-print', {
    responses: {
      '200': {
        description: 'BluePrint belonging to Processes',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BluePrint),
          },
        },
      },
    },
  })
  async getBluePrint(
    @param.path.number('id') id: typeof Processes.prototype.id,
  ): Promise<BluePrint> {
    return this.processesRepository.bluePrint(id);
  }
}
