import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {BluePrint, BluePrintRelations, Processes} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ProcessesRepository} from './processes.repository';

export class BluePrintRepository extends TimeStampRepositoryMixin<
  BluePrint,
  typeof BluePrint.prototype.id,
  Constructor<
    DefaultCrudRepository<
      BluePrint,
      typeof BluePrint.prototype.id,
      BluePrintRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processes: BelongsToAccessor<Processes, typeof BluePrint.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessesRepository') protected processesRepositoryGetter: Getter<ProcessesRepository>,) {
    super(BluePrint, dataSource);
    this.processes = this.createBelongsToAccessorFor('processes', processesRepositoryGetter,);
    this.registerInclusionResolver('processes', this.processes.inclusionResolver);
  }
}
