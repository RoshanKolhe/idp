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
import {Levels} from '../models';
import {MemberRepository, LevelsRepository} from '../repositories';

export class LevelsController {
  constructor(
    @repository(LevelsRepository)
    public levelsRepository: LevelsRepository,
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
  ) {}

  @post('/levels')
  @response(200, {
    description: 'Levels model instance',
    content: {'application/json': {schema: getModelSchemaRef(Levels)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Levels, {
            title: 'NewLevels',
            exclude: ['id'],
          }),
        },
      },
    })
    levels: Omit<Levels, 'id'>,
  ): Promise<Levels> {
    return this.levelsRepository.create(levels);
  }

  @get('/levels/count')
  @response(200, {
    description: 'Levels model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Levels) where?: Where<Levels>,
  ): Promise<Count> {
    return this.levelsRepository.count(where);
  }

 // LevelsController.ts

@get('/levels')
@response(200, {
  description: 'Array of Levels model instances',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: getModelSchemaRef(Levels, {includeRelations: true}),
          },
          count: {type: 'number'},
        },
      },
    },
  },
})
	async find(
	  @param.filter(Levels) filter?: Filter<Levels>,
	): Promise<{data: Levels[], count: number}> {
	  const filterWithIncludes = {
	    ...filter,
      where: {
        and: [{isDeleted: false}, filter?.where ?? {}],
      },
	    include: [{relation: 'members'}],
	  };
	  const data = await this.levelsRepository.find({
      ...filterWithIncludes,
      include: [
        {
          relation: 'members',
          scope: {where: {isDeleted: false}},
        },
      ],
    });
	  const count = await this.levelsRepository.count({
      and: [{isDeleted: false}, filter?.where ?? {}],
    });

	  return {
	    data:data,
	    count: count.count,
	  };
	}

  @patch('/levels')
  @response(200, {
    description: 'Levels PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Levels, {partial: true}),
        },
      },
    })
    levels: Levels,
    @param.where(Levels) where?: Where<Levels>,
  ): Promise<Count> {
    return this.levelsRepository.updateAll(levels, where);
  }

  @get('/levels/{id}')
  @response(200, {
    description: 'Levels model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Levels, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Levels, {exclude: 'where'}) filter?: FilterExcludingWhere<Levels>
  ): Promise<Levels> {
    const level = await this.levelsRepository.findById(id, filter);
    if (level.isDeleted) throw new HttpErrors.NotFound('Level not found');
    return this.levelsRepository.findById(id, {
      ...filter,
      include: [{relation: 'members', scope: {where: {isDeleted: false}}}],
    });
  }

  @patch('/levels/{id}')
  @response(204, {
    description: 'Levels PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Levels, {partial: true}),
        },
      },
    })
    levels: Levels,
  ): Promise<void> {
    await this.levelsRepository.updateById(id, levels);
  }

  @put('/levels/{id}')
  @response(204, {
    description: 'Levels PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() levels: Levels,
  ): Promise<void> {
    await this.levelsRepository.replaceById(id, levels);
  }

  @del('/levels/{id}')
  @response(204, {
    description: 'Levels DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    const deletedAt = new Date();

    await this.levelsRepository.updateById(id, {isDeleted: true, deletedAt});
    await this.memberRepository.updateAll({isDeleted: true, deletedAt}, {levelsId: id});
  }
}
