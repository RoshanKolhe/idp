import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  WorkflowInstances,
  Workflow,
} from '../models';
import {WorkflowInstancesRepository} from '../repositories';

export class WorkflowInstancesWorkflowController {
  constructor(
    @repository(WorkflowInstancesRepository)
    public workflowInstancesRepository: WorkflowInstancesRepository,
  ) { }

  @get('/workflow-instances/{id}/workflow', {
    responses: {
      '200': {
        description: 'Workflow belonging to WorkflowInstances',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow),
          },
        },
      },
    },
  })
  async getWorkflow(
    @param.path.number('id') id: typeof WorkflowInstances.prototype.id,
  ): Promise<Workflow> {
    return this.workflowInstancesRepository.workflow(id);
  }
}
