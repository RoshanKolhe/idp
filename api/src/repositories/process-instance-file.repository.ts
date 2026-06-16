import { Constructor, inject, Getter } from '@loopback/core';
import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { IdpDataSource } from '../datasources';
import {
  ProcessInstanceFile,
  ProcessInstanceFileRelations,
  ProcessInstances,
  DocumentType,
} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import { ProcessInstancesRepository } from './process-instances.repository';
import { DocumentTypeRepository } from './document-type.repository';

export class ProcessInstanceFileRepository extends TimeStampRepositoryMixin<
  ProcessInstanceFile,
  typeof ProcessInstanceFile.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstanceFile,
      typeof ProcessInstanceFile.prototype.id,
      ProcessInstanceFileRelations
    >
  >
>(DefaultCrudRepository) {
  public readonly processInstances: BelongsToAccessor<
    ProcessInstances,
    typeof ProcessInstanceFile.prototype.id
  >;

  public readonly documentType: BelongsToAccessor<
    DocumentType,
    typeof ProcessInstanceFile.prototype.id
  >;

  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
    @repository.getter('ProcessInstancesRepository')
    protected processInstancesRepositoryGetter: Getter<ProcessInstancesRepository>,
    @repository.getter('DocumentTypeRepository')
    protected documentTypeRepositoryGetter: Getter<DocumentTypeRepository>,
  ) {
    super(ProcessInstanceFile, dataSource);

    this.processInstances = this.createBelongsToAccessorFor(
      'processInstances',
      processInstancesRepositoryGetter,
    );
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);

    this.documentType = this.createBelongsToAccessorFor(
      'documentType',
      documentTypeRepositoryGetter,
    );
    this.registerInclusionResolver('documentType', this.documentType.inclusionResolver);
  }
}
