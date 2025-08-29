import {inject, Getter, Constructor} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Levels, LevelsRelations, Member, Escalation} from '../models';
import {MemberRepository} from './member.repository';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {EscalationRepository} from './escalation.repository';

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

  public readonly escalation: BelongsToAccessor<Escalation, typeof Levels.prototype.id>;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
    @repository.getter('MemberRepository')
    protected memberRepositoryGetter: Getter<MemberRepository>, @repository.getter('EscalationRepository') protected escalationRepositoryGetter: Getter<EscalationRepository>,
  ) {
    super(Levels, dataSource);
    this.escalation = this.createBelongsToAccessorFor('escalation', escalationRepositoryGetter,);
    this.registerInclusionResolver('escalation', this.escalation.inclusionResolver);

    this.members = this.createHasManyRepositoryFactoryFor(
      'members',
      memberRepositoryGetter
    );

    this.registerInclusionResolver('members', this.members.inclusionResolver);
  }
}
