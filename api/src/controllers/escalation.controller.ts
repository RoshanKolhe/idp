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
import { Escalation } from '../models';
import { EscalationRepository, UserRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';

export class EscalationController {
  constructor(
    @repository(EscalationRepository)
    public escalationRepository: EscalationRepository,
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
  @post('/escalations')
  @response(200, {
    description: 'Escalation model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Escalation) } },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Escalation, {
            title: 'NewEscalation',
            exclude: ['id'],
          }),
        },
      },
    })
    escalation: Omit<Escalation, 'id'>,
  ): Promise<Escalation> {
    return this.escalationRepository.create({ ...escalation, userId: currentUser.id });
  }

  @get('/escalations/count')
  @response(200, {
    description: 'Escalation model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Escalation) where?: Where<Escalation>,
  ): Promise<Count> {
    return this.escalationRepository.count(where);
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
  @get('/escalations')
  @response(200, {
    description: 'Array of Escalation model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Escalation, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(Escalation) filter?: Filter<Escalation>,
  ): Promise<Escalation[]> {
    const user = await this.userRepository.findById(currentUser.id);

    if (user && user.permissions.includes('super_admin')) {
      return await this.escalationRepository.find(
        {
          ...filter,
          where: {
            ...filter?.where,
            isDeleted: false,
          },
          include: [
            {
              relation: 'levels',
              scope: {
                include: [
                  { relation: 'members' }
                ]
              }
            }
          ]
        }
      );
    }

    return await this.escalationRepository.find(
      {
        ...filter,
        where: {
          ...filter?.where,
          and: [
            { isDeleted: false },
            { userId: currentUser.id }
          ]
        },
        include: [
          {
            relation: 'levels',
            scope: {
              include: [
                { relation: 'members' }
              ]
            }
          }
        ]
      }
    );
  }

  // @patch('/escalations')
  // @response(200, {
  //   description: 'Escalation PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Escalation, { partial: true }),
  //       },
  //     },
  //   })
  //   escalation: Escalation,
  //   @param.where(Escalation) where?: Where<Escalation>,
  // ): Promise<Count> {
  //   return this.escalationRepository.updateAll(escalation, where);
  // }

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
  @get('/escalations/{id}')
  @response(200, {
    description: 'Escalation model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Escalation, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @param.filter(Escalation, { exclude: 'where' }) filter?: FilterExcludingWhere<Escalation>
  ): Promise<Escalation> {
    const user = await this.userRepository.findById(currentUser.id);
    const escalation = await this.escalationRepository.findById(id, filter);

    if (user && (user.permissions.includes('super_admin') || user.id === escalation.id)) {
      return this.escalationRepository.findById(id, filter);
    }

    throw new HttpErrors.Unauthorized('Unauthorized access');
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
  @patch('/escalations/{id}')
  @response(204, {
    description: 'Escalation PATCH success',
  })
  async updateById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Escalation, { partial: true }),
        },
      },
    })
    escalation: Escalation,
  ): Promise<void> {
    const user = await this.userRepository.findById(currentUser.id);
    const escalationData = await this.escalationRepository.findById(id);

    if (user && (user.permissions.includes('super_admin') || user.id === escalationData.userId)) {
      await this.escalationRepository.updateById(id, escalation);
      return;
    }

    throw new HttpErrors.Unauthorized('Unauthorized access');
  }

  // @put('/escalations/{id}')
  // @response(204, {
  //   description: 'Escalation PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() escalation: Escalation,
  // ): Promise<void> {
  //   await this.escalationRepository.replaceById(id, escalation);
  // }

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
  @del('/escalations/{id}')
  @response(204, {
    description: 'Escalation DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.escalationRepository.deleteById(id);
  }
}
