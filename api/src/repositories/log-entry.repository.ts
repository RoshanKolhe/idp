import { Constructor, inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { IdpMongoDbDataSource } from '../datasources';
import { LogEntry, LogEntryRelations } from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class LogEntryRepository extends TimeStampRepositoryMixin<
  LogEntry,
  typeof LogEntry.prototype.id,
  Constructor<
    DefaultCrudRepository<
      LogEntry,
      typeof LogEntry.prototype.id,
      LogEntryRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.idpMongoDB') dataSource: IdpMongoDbDataSource,
  ) {
    super(LogEntry, dataSource);
  }
}
