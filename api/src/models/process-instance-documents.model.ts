import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ProcessInstances} from './process-instances.model';
import {DocumentType} from './document-type.model';

@model()
export class ProcessInstanceDocuments extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'object',
    required: true
  })
  documentDetails: {
    fileName: string;
    fileUrl: string;
    fileSize: string;
  }

  @belongsTo(() => ProcessInstances)
  processInstancesId: number;

  @belongsTo(() => DocumentType)
  documentTypeId: number;

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

  constructor(data?: Partial<ProcessInstanceDocuments>) {
    super(data);
  }
}

export interface ProcessInstanceDocumentsRelations {
  // describe navigational properties here
}

export type ProcessInstanceDocumentsWithRelations = ProcessInstanceDocuments & ProcessInstanceDocumentsRelations;
