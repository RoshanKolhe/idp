import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessInstanceDocuments, ProcessInstanceDocumentsRelations, ProcessInstances, DocumentType} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessInstancesRepository} from './process-instances.repository';
import {DocumentTypeRepository} from './document-type.repository';

export class ProcessInstanceDocumentsRepository extends TimeStampRepositoryMixin<
  ProcessInstanceDocuments,
  typeof ProcessInstanceDocuments.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstanceDocuments,
      typeof ProcessInstanceDocuments.prototype.id,
      ProcessInstanceDocumentsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processInstances: BelongsToAccessor<ProcessInstances, typeof ProcessInstanceDocuments.prototype.id>;

  public readonly documentType: BelongsToAccessor<DocumentType, typeof ProcessInstanceDocuments.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessInstancesRepository') protected processInstancesRepositoryGetter: Getter<ProcessInstancesRepository>, @repository.getter('DocumentTypeRepository') protected documentTypeRepositoryGetter: Getter<DocumentTypeRepository>,) {
    super(ProcessInstanceDocuments, dataSource);
    this.documentType = this.createBelongsToAccessorFor('documentType', documentTypeRepositoryGetter,);
    this.registerInclusionResolver('documentType', this.documentType.inclusionResolver);
    this.processInstances = this.createBelongsToAccessorFor('processInstances', processInstancesRepositoryGetter,);
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);
  }
}