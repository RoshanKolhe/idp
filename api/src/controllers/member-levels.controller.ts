import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Member,
  Levels,
} from '../models';
import {MemberRepository} from '../repositories';

export class MemberLevelsController {
  constructor(
    @repository(MemberRepository)
    public memberRepository: MemberRepository,
  ) { }

  @get('/members/{id}/levels', {
    responses: {
      '200': {
        description: 'Levels belonging to Member',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Levels),
          },
        },
      },
    },
  })
  async getLevels(
    @param.path.number('id') id: typeof Member.prototype.id,
  ): Promise<Levels> {
    return this.memberRepository.levels(id);
  }
}
