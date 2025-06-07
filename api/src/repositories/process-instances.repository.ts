import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessInstances, ProcessInstancesRelations, Processes} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessesRepository} from './processes.repository';

export class ProcessInstancesRepository extends TimeStampRepositoryMixin<
  ProcessInstances,
  typeof ProcessInstances.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstances,
      typeof ProcessInstances.prototype.id,
      ProcessInstancesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processes: BelongsToAccessor<Processes, typeof ProcessInstances.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessesRepository') protected processesRepositoryGetter: Getter<ProcessesRepository>,) {
    super(ProcessInstances, dataSource);
    this.processes = this.createBelongsToAccessorFor('processes', processesRepositoryGetter,);
    this.registerInclusionResolver('processes', this.processes.inclusionResolver);
  }
}
