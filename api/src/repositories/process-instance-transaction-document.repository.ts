import { Constructor, inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { IdpDataSource } from '../datasources';
import {
  ProcessInstanceTransactionDocument,
  ProcessInstanceTransactionDocumentRelations,
  ProcessInstanceTransactions,
  ProcessInstanceFile,
} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import { ProcessInstanceTransactionsRepository } from './process-instance-transactions.repository';
import { ProcessInstanceFileRepository } from './process-instance-file.repository';

export class ProcessInstanceTransactionDocumentRepository extends TimeStampRepositoryMixin<
  ProcessInstanceTransactionDocument,
  typeof ProcessInstanceTransactionDocument.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstanceTransactionDocument,
      typeof ProcessInstanceTransactionDocument.prototype.id,
      ProcessInstanceTransactionDocumentRelations
    >
  >
>(DefaultCrudRepository) {
  public readonly processInstanceTransactions: BelongsToAccessor<
    ProcessInstanceTransactions,
    typeof ProcessInstanceTransactionDocument.prototype.id
  >;

  public readonly processInstanceFile: BelongsToAccessor<
    ProcessInstanceFile,
    typeof ProcessInstanceTransactionDocument.prototype.id
  >;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
    @repository.getter('ProcessInstanceTransactionsRepository')
    protected processInstanceTransactionsRepositoryGetter: Getter<ProcessInstanceTransactionsRepository>,
    @repository.getter('ProcessInstanceFileRepository')
    protected processInstanceFileRepositoryGetter: Getter<ProcessInstanceFileRepository>,
  ) {
    super(ProcessInstanceTransactionDocument, dataSource);

    this.processInstanceTransactions = this.createBelongsToAccessorFor(
      'processInstanceTransactions',
      processInstanceTransactionsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'processInstanceTransactions',
      this.processInstanceTransactions.inclusionResolver,
    );

    this.processInstanceFile = this.createBelongsToAccessorFor(
      'processInstanceFile',
      processInstanceFileRepositoryGetter,
    );
    this.registerInclusionResolver('processInstanceFile', this.processInstanceFile.inclusionResolver);
  }
}
