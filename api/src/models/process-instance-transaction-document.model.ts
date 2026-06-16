import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ProcessInstanceTransactions } from './process-instance-transactions.model';
import { ProcessInstanceFile } from './process-instance-file.model';

@model()
export class ProcessInstanceTransactionDocument extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => ProcessInstanceTransactions)
  processInstanceTransactionsId: number;

  @belongsTo(() => ProcessInstanceFile)
  processInstanceFileId: number;

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

  constructor(data?: Partial<ProcessInstanceTransactionDocument>) {
    super(data);
  }
}

export interface ProcessInstanceTransactionDocumentRelations {}

export type ProcessInstanceTransactionDocumentWithRelations =
  ProcessInstanceTransactionDocument & ProcessInstanceTransactionDocumentRelations;
