import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {IngestionChannelType, IngestionChannelTypeRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class IngestionChannelTypeRepository extends TimeStampRepositoryMixin<
  IngestionChannelType,
  typeof IngestionChannelType.prototype.id,
  Constructor<
    DefaultCrudRepository<
      IngestionChannelType,
      typeof IngestionChannelType.prototype.id,
      IngestionChannelTypeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.idp') dataSource: IdpDataSource) {
    super(IngestionChannelType, dataSource);
  }
}
