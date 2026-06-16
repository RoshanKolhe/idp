import { Constructor, inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { IdpDataSource } from '../datasources';
import {
  ProcessInstanceTransactions,
  ProcessInstanceTransactionsRelations,
  ProcessInstances,
  ProcessInstanceTransactionDocument,
} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import { ProcessInstancesRepository } from './process-instances.repository';
import { ProcessInstanceTransactionDocumentRepository } from './process-instance-transaction-document.repository';

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
  public readonly processInstances: BelongsToAccessor<
    ProcessInstances,
    typeof ProcessInstanceTransactions.prototype.id
  >;

  public readonly processInstanceTransactionDocuments: HasManyRepositoryFactory<
    ProcessInstanceTransactionDocument,
    typeof ProcessInstanceTransactions.prototype.id
  >;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
    @repository.getter('ProcessInstancesRepository')
    protected processInstancesRepositoryGetter: Getter<ProcessInstancesRepository>,
    @repository.getter('ProcessInstanceTransactionDocumentRepository')
    protected processInstanceTransactionDocumentRepositoryGetter: Getter<ProcessInstanceTransactionDocumentRepository>,
  ) {
    super(ProcessInstanceTransactions, dataSource);

    this.processInstances = this.createBelongsToAccessorFor(
      'processInstances',
      processInstancesRepositoryGetter,
    );
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);

    this.processInstanceTransactionDocuments = this.createHasManyRepositoryFactoryFor(
      'processInstanceTransactionDocuments',
      processInstanceTransactionDocumentRepositoryGetter,
    );
    this.registerInclusionResolver(
      'processInstanceTransactionDocuments',
      this.processInstanceTransactionDocuments.inclusionResolver,
    );
  }
}
