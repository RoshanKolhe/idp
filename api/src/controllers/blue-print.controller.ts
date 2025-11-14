import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { BluePrint } from '../models';
import { BluePrintRepository, ProcessesRepository, UserRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';

export class BluePrintController {
  constructor(
    @repository(BluePrintRepository)
    public bluePrintRepository: BluePrintRepository,
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @post('/blue-prints')
  @response(200, {
    description: 'BluePrint model instance',
    content: { 'application/json': { schema: getModelSchemaRef(BluePrint) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, {
            title: 'NewBluePrint',
            exclude: ['id'],
          }),
        },
      },
    })
    bluePrint: Omit<BluePrint, 'id'>,
  ): Promise<BluePrint> {
    const existingBluePrint = await this.bluePrintRepository.findOne({ where: { processesId: bluePrint.processesId } });

    if (!existingBluePrint) {
      const bluePrintData = await this.bluePrintRepository.create(bluePrint);

      if (bluePrintData && bluePrintData.processesId) {
        await this.processesRepository.updateById(bluePrintData.processesId, { bluePrintId: bluePrintData.id });
      }

      return bluePrintData;
    }

    await this.bluePrintRepository.updateById(existingBluePrint.id, bluePrint);
    const bluePrintData = await this.bluePrintRepository.findById(existingBluePrint.id);
    return bluePrintData;
  }

  @get('/blue-prints/count')
  @response(200, {
    description: 'BluePrint model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(BluePrint) where?: Where<BluePrint>,
  ): Promise<Count> {
    return this.bluePrintRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @get('/blue-prints')
  @response(200, {
    description: 'Array of BluePrint model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BluePrint, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(BluePrint) filter?: Filter<BluePrint>,
  ): Promise<BluePrint[]> {
    return this.bluePrintRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @patch('/blue-prints')
  @response(200, {
    description: 'BluePrint PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, { partial: true }),
        },
      },
    })
    bluePrint: BluePrint,
    @param.where(BluePrint) where?: Where<BluePrint>,
  ): Promise<Count> {
    return this.bluePrintRepository.updateAll(bluePrint, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @get('/blue-prints/{id}')
  @response(200, {
    description: 'BluePrint model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BluePrint, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(BluePrint, { exclude: 'where' }) filter?: FilterExcludingWhere<BluePrint>
  ): Promise<BluePrint> {
    return this.bluePrintRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @patch('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BluePrint, { partial: true }),
        },
      },
    })
    bluePrint: BluePrint,
  ): Promise<void> {
    await this.bluePrintRepository.updateById(id, bluePrint);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @put('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() bluePrint: BluePrint,
  ): Promise<void> {
    await this.bluePrintRepository.replaceById(id, bluePrint);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] }
  })
  @del('/blue-prints/{id}')
  @response(204, {
    description: 'BluePrint DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.bluePrintRepository.deleteById(id);
  }

  // Get blue print by process id
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN, PermissionKeys.COMPANY] }
  })
  @get('/blue-prints/processes/{id}')
  async getBluePrintById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
  ): Promise<{ success: boolean; message: string; data: {} | null }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      const bluePrint: any = await this.bluePrintRepository.findOne({
        where: {
          processesId: id,
        },
        include: [
          { relation: 'processes' }
        ]
      });

      if (!bluePrint) {
        return {
          success: false,
          message: `No blue print found for process id ${id}`,
          data: null
        }
      }

      if (bluePrint && (bluePrint.processes.userId === user.id || user.permissions.includes('super_admin'))) {
        return {
          success: true,
          message: `Blue print for process id ${id}`,
          data: bluePrint
        }
      }

      throw new HttpErrors.Unauthorized('Unauthorized access');
    } catch (error) {
      throw error;
    }
  }
}
