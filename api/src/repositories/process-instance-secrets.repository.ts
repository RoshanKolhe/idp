import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessInstanceSecrets, ProcessInstanceSecretsRelations, ProcessInstances} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessInstancesRepository} from './process-instances.repository';

export class ProcessInstanceSecretsRepository extends TimeStampRepositoryMixin<
  ProcessInstanceSecrets,
  typeof ProcessInstanceSecrets.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstanceSecrets,
      typeof ProcessInstanceSecrets.prototype.id,
      ProcessInstanceSecretsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processInstances: BelongsToAccessor<ProcessInstances, typeof ProcessInstanceSecrets.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessInstancesRepository') protected processInstancesRepositoryGetter: Getter<ProcessInstancesRepository>,) {
    super(ProcessInstanceSecrets, dataSource);
    this.processInstances = this.createBelongsToAccessorFor('processInstances', processInstancesRepositoryGetter,);
    this.registerInclusionResolver('processInstances', this.processInstances.inclusionResolver);
  }
}