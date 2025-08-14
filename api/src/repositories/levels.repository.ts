import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Levels, LevelsRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';



export class LevelsRepository extends TimeStampRepositoryMixin<
  Levels,
  typeof Levels.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Levels,
      typeof Levels.prototype.id,
      LevelsRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
  ) {
    super(Levels, dataSource);
  }
}
