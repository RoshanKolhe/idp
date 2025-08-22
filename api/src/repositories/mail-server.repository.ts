import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {MailServer, MailServerRelations} from '../models';

export class MailServerRepository extends DefaultCrudRepository<
  MailServer,
  typeof MailServer.prototype.id,
  MailServerRelations
> {
  constructor(
    @inject('datasources.idp') dataSource: IdpDataSource,
  ) {
    super(MailServer, dataSource);
  }
}
