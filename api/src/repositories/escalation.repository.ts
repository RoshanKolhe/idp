import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Escalation, EscalationRelations, Levels, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {LevelsRepository} from './levels.repository';
import {UserRepository} from './user.repository';

export class EscalationRepository extends TimeStampRepositoryMixin<
  Escalation,
  typeof Escalation.prototype.id,
  Constructor<
    DefaultCrudRepository<Escalation, typeof Escalation.prototype.id, EscalationRelations>
  >
>(DefaultCrudRepository) {

  public readonly levels: HasManyRepositoryFactory<Levels, typeof Escalation.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Escalation.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('LevelsRepository') protected levelsRepositoryGetter: Getter<LevelsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(Escalation, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.levels = this.createHasManyRepositoryFactoryFor('levels', levelsRepositoryGetter,);
    this.registerInclusionResolver('levels', this.levels.inclusionResolver);
  }
}
