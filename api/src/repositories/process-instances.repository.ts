import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessInstances, ProcessInstancesRelations, Processes, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessesRepository} from './processes.repository';
import {UserRepository} from './user.repository';

export class ProcessInstancesRepository extends TimeStampRepositoryMixin<
  ProcessInstances,
  typeof ProcessInstances.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProcessInstances,
      typeof ProcessInstances.prototype.id,
      ProcessInstancesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processes: BelongsToAccessor<Processes, typeof ProcessInstances.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof ProcessInstances.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessesRepository') protected processesRepositoryGetter: Getter<ProcessesRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,) {
    super(ProcessInstances, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.processes = this.createBelongsToAccessorFor('processes', processesRepositoryGetter,);
    this.registerInclusionResolver('processes', this.processes.inclusionResolver);
  }
}
