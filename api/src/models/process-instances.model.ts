import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Processes} from './processes.model';

@model()
export class ProcessInstances extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  processInstanceName: string;

  @property({
    type: 'string'
  })
  processInstanceFolderName: string;

  @property({
    type: 'string',
    // required: true,
  })
  processInstanceDescription?: string;

  @property({
    type: 'string',
    // required: true,
  })
  currentStage?: string;

  @property({
    type: 'boolean',
    required: true
  })
  isInstanceRunning: boolean;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'date',
  })
  deletedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'string',
  })
  remark?: string;

  @belongsTo(() => Processes)
  processesId: number;

  constructor(data?: Partial<ProcessInstances>) {
    super(data);
  }
}

export interface ProcessInstancesRelations {
  // describe navigational properties here
}

export type ProcessInstancesWithRelations = ProcessInstances & ProcessInstancesRelations;
