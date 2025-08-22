import {inject, Getter, Constructor} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Levels, LevelsRelations, Member} from '../models';
import {MemberRepository} from './member.repository';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class LevelsRepository extends TimeStampRepositoryMixin<
  Levels,
  typeof Levels.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Levels,
      typeof Levels.prototype.id,
      LevelsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly members: HasManyRepositoryFactory<Member, typeof Levels.prototype.id>;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>
  ) {
    super(Levels, dataSource);

    this.members = this.createHasManyRepositoryFactoryFor(
      'members',
      memberRepositoryGetter
    );

    this.registerInclusionResolver('members', this.members.inclusionResolver);
  }
}
