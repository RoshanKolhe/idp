import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {MailServer, MailServerRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class MailServerRepository extends TimeStampRepositoryMixin<
  MailServer,
  typeof MailServer.prototype.id,
  Constructor<
    DefaultCrudRepository<
      MailServer,
      typeof MailServer.prototype.id,
      MailServerRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
  ) {
    super(MailServer, dataSource);
  }
}
