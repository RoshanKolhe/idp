import { Entity, model, property, belongsTo, hasMany } from '@loopback/repository';
import { ProcessInstances } from './process-instances.model';
import { ProcessInstanceTransactionDocument } from './process-instance-transaction-document.model';

@model()
export class ProcessInstanceTransactions extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  currentStage?: string;

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

  @belongsTo(() => ProcessInstances)
  processInstancesId: number;

  @hasMany(() => ProcessInstanceTransactionDocument)
  processInstanceTransactionDocuments: ProcessInstanceTransactionDocument[];

  constructor(data?: Partial<ProcessInstanceTransactions>) {
    super(data);
  }
}

export interface ProcessInstanceTransactionsRelations {
  // describe navigational properties here
}

export type ProcessInstanceTransactionsWithRelations = ProcessInstanceTransactions & ProcessInstanceTransactionsRelations;
