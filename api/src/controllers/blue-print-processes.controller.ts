import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BluePrint,
  Processes,
} from '../models';
import {BluePrintRepository} from '../repositories';

export class BluePrintProcessesController {
  constructor(
    @repository(BluePrintRepository)
    public bluePrintRepository: BluePrintRepository,
  ) { }

  @get('/blue-prints/{id}/processes', {
    responses: {
      '200': {
        description: 'Processes belonging to BluePrint',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Processes),
          },
        },
      },
    },
  })
  async getProcesses(
    @param.path.number('id') id: typeof BluePrint.prototype.id,
  ): Promise<Processes> {
    return this.bluePrintRepository.processes(id);
  }
}
