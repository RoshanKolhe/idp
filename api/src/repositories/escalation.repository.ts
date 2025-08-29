import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Escalation, EscalationRelations, Levels} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {LevelsRepository} from './levels.repository';

export class EscalationRepository extends TimeStampRepositoryMixin<
  Escalation,
  typeof Escalation.prototype.id,
  Constructor<
    DefaultCrudRepository<Escalation, typeof Escalation.prototype.id, EscalationRelations>
  >
>(DefaultCrudRepository) {

  public readonly levels: HasManyRepositoryFactory<Levels, typeof Escalation.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('LevelsRepository') protected levelsRepositoryGetter: Getter<LevelsRepository>,) {
    super(Escalation, dataSource);
    this.levels = this.createHasManyRepositoryFactoryFor('levels', levelsRepositoryGetter,);
    this.registerInclusionResolver('levels', this.levels.inclusionResolver);
  }
}
