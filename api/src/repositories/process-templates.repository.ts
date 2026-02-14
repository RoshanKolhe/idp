import { Constructor, inject, Getter} from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import { IdpDataSource } from '../datasources';
import { ProcessTemplates, ProcessTemplatesRelations, Processes} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessesRepository} from './processes.repository';

export class ProcessTemplatesRepository extends TimeStampRepositoryMixin<
  ProcessTemplates,
  typeof ProcessTemplates.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessTemplates,
      typeof ProcessTemplates.prototype.id,
      ProcessTemplatesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processes: BelongsToAccessor<Processes, typeof ProcessTemplates.prototype.id>;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessesRepository') protected processesRepositoryGetter: Getter<ProcessesRepository>,
  ) {
    super(ProcessTemplates, dataSource);
    this.processes = this.createBelongsToAccessorFor('processes', processesRepositoryGetter,);
    this.registerInclusionResolver('processes', this.processes.inclusionResolver);
  }
}
