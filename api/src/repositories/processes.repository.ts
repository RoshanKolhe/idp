import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {IdpDataSource} from '../datasources';
import {Processes, ProcessesRelations, ProcessType, BluePrint, User, ProcessTemplates} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ProcessTypeRepository} from './process-type.repository';
import {BluePrintRepository} from './blue-print.repository';
import {UserRepository} from './user.repository';
import {ProcessTemplatesRepository} from './process-templates.repository';

export class ProcessesRepository extends TimeStampRepositoryMixin<
  Processes,
  typeof Processes.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Processes,
      typeof Processes.prototype.id,
      ProcessesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly processType: BelongsToAccessor<ProcessType, typeof Processes.prototype.id>;

  public readonly bluePrint: BelongsToAccessor<BluePrint, typeof Processes.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Processes.prototype.id>;

  public readonly processTemplates: BelongsToAccessor<ProcessTemplates, typeof Processes.prototype.id>;

  constructor(@inject('datasources.idp') dataSource: IdpDataSource, @repository.getter('ProcessTypeRepository') protected processTypeRepositoryGetter: Getter<ProcessTypeRepository>, @repository.getter('BluePrintRepository') protected bluePrintRepositoryGetter: Getter<BluePrintRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ProcessTemplatesRepository') protected processTemplatesRepositoryGetter: Getter<ProcessTemplatesRepository>,) {
    super(Processes, dataSource);
    this.processTemplates = this.createBelongsToAccessorFor('processTemplates', processTemplatesRepositoryGetter,);
    this.registerInclusionResolver('processTemplates', this.processTemplates.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.bluePrint = this.createBelongsToAccessorFor('bluePrint', bluePrintRepositoryGetter,);
    this.registerInclusionResolver('bluePrint', this.bluePrint.inclusionResolver);
    this.processType = this.createBelongsToAccessorFor('processType', processTypeRepositoryGetter,);
    this.registerInclusionResolver('processType', this.processType.inclusionResolver);
  }
}
