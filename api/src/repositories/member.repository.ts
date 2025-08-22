import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Member, MemberRelations, Levels} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {LevelsRepository} from './levels.repository';

export class MemberRepository extends TimeStampRepositoryMixin<
  Member,
  typeof Member.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Member,
      typeof Member.prototype.id,
      MemberRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly levels: BelongsToAccessor<Levels, typeof Member.prototype.id>;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('LevelsRepository') protected levelsRepositoryGetter: Getter<LevelsRepository>,
  ) {
    super(Member, dataSource);
    this.levels = this.createBelongsToAccessorFor('levels', levelsRepositoryGetter,);
    this.registerInclusionResolver('levels', this.levels.inclusionResolver);
  }
}
