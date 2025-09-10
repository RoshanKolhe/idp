import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  WorkflowBlueprint,
  Workflow,
} from '../models';
import {WorkflowBlueprintRepository} from '../repositories';

export class WorkflowBlueprintWorkflowController {
  constructor(
    @repository(WorkflowBlueprintRepository)
    public workflowBlueprintRepository: WorkflowBlueprintRepository,
  ) { }

  @get('/workflow-blueprints/{id}/workflow', {
    responses: {
      '200': {
        description: 'Workflow belonging to WorkflowBlueprint',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Workflow),
          },
        },
      },
    },
  })
  async getWorkflow(
    @param.path.number('id') id: typeof WorkflowBlueprint.prototype.id,
  ): Promise<Workflow> {
    return this.workflowBlueprintRepository.workflow(id);
  }
}
