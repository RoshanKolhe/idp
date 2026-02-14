import { repository } from "@loopback/repository";
import { BluePrintRepository, ProcessTemplatesRepository } from "../repositories";
import { HttpErrors } from "@loopback/rest";

export class ProcessTemplateService {
    constructor(
        @repository(ProcessTemplatesRepository)
        private processTemplateRepository: ProcessTemplatesRepository,
        @repository(BluePrintRepository)
        private bluePrintRepository: BluePrintRepository
    ) { }

    // create blueprint for process with template...
    async createBlueprintFromTemplate(processId: number, templateId: number) {
        try {
            const template = await this.processTemplateRepository.findById(templateId);

            if (!template) {
                throw new HttpErrors.NotFound("Template not found");
            }

            const templateBlueprint = await this.bluePrintRepository.findOne({ where: { processesId: template.processesId } });

            const blueprintObj = {
                nodes: templateBlueprint?.nodes,
                edges: templateBlueprint?.edges,
                edgeSettings: templateBlueprint?.edgeSettings,
                bluePrint: templateBlueprint?.bluePrint,
                processesId: processId,
                isActive: true,
                isDeleted: false
            }

            const blueprint = await this.bluePrintRepository.create(blueprintObj);

            if (blueprint) {
                return {
                    success: true
                }
            }

            throw new HttpErrors.BadRequest('Error while creating blueprint');
        } catch (error) {
            throw error;
        }
    }
}