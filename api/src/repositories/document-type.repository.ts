import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {DocumentType, DocumentTypeRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class DocumentTypeRepository extends TimeStampRepositoryMixin<
  DocumentType,
  typeof DocumentType.prototype.id,
  Constructor<
    DefaultCrudRepository<
      DocumentType,
      typeof DocumentType.prototype.id,
      DocumentTypeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.idp') dataSource: IdpDataSource) {
    super(DocumentType, dataSource);
  }
}
