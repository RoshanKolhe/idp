import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Workflow,
  WorkflowBlueprint,
} from '../models';
import {WorkflowRepository} from '../repositories';

export class WorkflowWorkflowBlueprintController {
  constructor(
    @repository(WorkflowRepository)
    public workflowRepository: WorkflowRepository,
  ) { }

  @get('/workflows/{id}/workflow-blueprint', {
    responses: {
      '200': {
        description: 'WorkflowBlueprint belonging to Workflow',
        content: {
          'application/json': {
            schema: getModelSchemaRef(WorkflowBlueprint),
          },
        },
      },
    },
  })
  async getWorkflowBlueprint(
    @param.path.number('id') id: typeof Workflow.prototype.id,
  ): Promise<WorkflowBlueprint> {
    return this.workflowRepository.workflowBlueprint(id);
  }
}
