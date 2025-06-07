import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {AiModel, AiModelRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class AiModelRepository extends TimeStampRepositoryMixin<
  AiModel,
  typeof AiModel.prototype.id,
  Constructor<
    DefaultCrudRepository<
      AiModel,
      typeof AiModel.prototype.id,
      AiModelRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.idp') dataSource: IdpDataSource) {
    super(AiModel, dataSource);
  }
}
