import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {FileType, FileTypeRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class FileTypeRepository extends TimeStampRepositoryMixin<
  FileType,
  typeof FileType.prototype.id,
  Constructor<
    DefaultCrudRepository<
      FileType,
      typeof FileType.prototype.id,
      FileTypeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.idp') dataSource: IdpDataSource) {
    super(FileType, dataSource);
  }
}
