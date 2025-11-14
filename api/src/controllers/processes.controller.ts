import {
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
import { Processes } from '../models';
import { ProcessesRepository, UserRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';

export class ProcessesController {
  constructor(
    @repository(ProcessesRepository)
    public processesRepository: ProcessesRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY
      ],
    },
  })
  @post('/processes')
  @response(200, {
    description: 'Processes model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Processes) } },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Processes, {
            title: 'NewProcesses',
            exclude: ['id'],
          }),
        },
      },
    })
    processes: Omit<Processes, 'id'>,
  ): Promise<Processes> {
    return this.processesRepository.create({
      ...processes,
      userId: currentUser.id
    });
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY
      ],
    },
  })
  @get('/processes')
  @response(200, {
    description: 'Array of Processes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Processes, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(Processes) filter?: Filter<Processes>,
  ): Promise<Processes[]> {
    const user = await this.userRepository.findById(currentUser.id);
    if (user && user.permissions.includes('super_admin')) {
      return this.processesRepository.find(
        {
          ...filter,
          where: {
            ...filter?.where,
            and: [
              { isDeleted: false }
            ]
          }
        }
      );
    }

    return this.processesRepository.find(
      {
        ...filter,
        where: {
          ...filter?.where,
          and: [
            { userId: currentUser.id },
            { isDeleted: false }
          ]
        }
      }
    );
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY
      ],
    },
  })
  @get('/processes/{id}')
  @response(200, {
    description: 'Processes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Processes, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @param.filter(Processes, { exclude: 'where' })
    filter?: FilterExcludingWhere<Processes>,
  ): Promise<Processes> {
    const user = await this.userRepository.findById(currentUser.id);
    const process = await this.processesRepository.findById(id, { ...filter, include: [{ relation: 'bluePrint' }] });

    if (user && (user.permissions.includes('super_admin') || user.id === process.userId)) {
      return process;
    }

    throw new HttpErrors.Unauthorized('Unauthorize access');
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY
      ],
    },
  })
  @patch('/processes/{id}')
  @response(204, {
    description: 'Processes PATCH success',
  })
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Processes, { partial: true }),
        },
      },
    })
    processes: Processes,
  ): Promise<void> {
    const user = await this.userRepository.findById(currentUser.id);
    const process = await this.processesRepository.findById(id);

    if (user && (user.permissions.includes('super_admin') || user.id === process.userId)) {
      await this.processesRepository.updateById(id, processes);
      return;
    }

    throw new HttpErrors.Unauthorized('Unauthorize access');
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.SUPER_ADMIN,
        PermissionKeys.ADMIN,
        PermissionKeys.COMPANY
      ],
    },
  })
  @del('/processes/{id}')
  @response(204, {
    description: 'Processes DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processesRepository.deleteById(id);
  }
}
