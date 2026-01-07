import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessInstanceTransactions, ProcessInstanceTransactionsRelations, ProcessInstances} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessInstancesRepository} from './process-instances.repository';

export class ProcessInstanceTransactionsRepository extends TimeStampRepositoryMixin<
  ProcessInstanceTransactions,
  typeof ProcessInstanceTransactions.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstanceTransactions,
      typeof ProcessInstanceTransactions.prototype.id,
      ProcessInstanceTransactionsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processInstances: BelongsToAccessor<ProcessInstances, typeof ProcessInstanceTransactions.prototype.id>;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessInstancesRepository') protected processInstancesRepositoryGetter: Getter<ProcessInstancesRepository>,
  ) {
    super(ProcessInstanceTransactions, dataSource);
    this.processInstances = this.createBelongsToAccessorFor('processInstances', processInstancesRepositoryGetter,);
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);
  }
}
