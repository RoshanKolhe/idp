import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ProcessInstances } from './process-instances.model';
import { DocumentType } from './document-type.model';

@model()
export class ProcessInstanceFile extends Entity {
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
  documentName: string;

  @property({
    type: 'string',
    required: true,
  })
  fileUrl: string;

  @property({
    type: 'string',
  })
  classifiedType?: string;

  @property({
    type: 'object',
  })
  metadata?: object;

  @belongsTo(() => ProcessInstances)
  processInstancesId: number;

  @belongsTo(() => DocumentType)
  documentTypeId?: number;

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

  constructor(data?: Partial<ProcessInstanceFile>) {
    super(data);
  }
}

export interface ProcessInstanceFileRelations {}

export type ProcessInstanceFileWithRelations = ProcessInstanceFile & ProcessInstanceFileRelations;
