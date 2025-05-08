import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessType, ProcessTypeRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class ProcessTypeRepository extends TimeStampRepositoryMixin<
  ProcessType,
  typeof ProcessType.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessType,
      typeof ProcessType.prototype.id,
      ProcessTypeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.idp') dataSource: IdpDataSource) {
    super(ProcessType, dataSource);
  }
}
