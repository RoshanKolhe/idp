import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {ProcessType, ProcessTypeRelations, Processes} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ProcessesRepository} from './processes.repository';

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

  public readonly processes: HasManyRepositoryFactory<Processes, typeof ProcessType.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessesRepository') protected processesRepositoryGetter: Getter<ProcessesRepository>,) {
    super(ProcessType, dataSource);
    this.processes = this.createHasManyRepositoryFactoryFor('processes', processesRepositoryGetter,);
    this.registerInclusionResolver('processes', this.processes.inclusionResolver);
  }
}
