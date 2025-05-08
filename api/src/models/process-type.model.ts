import {Entity, model, property} from '@loopback/repository';

@model()
export class ProcessType extends Entity {
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
  processType: string;

  @property({
    type: 'string',
  })
  description?: string;

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

  constructor(data?: Partial<ProcessType>) {
    super(data);
  }
}

export interface ProcessTypeRelations {
  // describe navigational properties here
}

export type ProcessTypeWithRelations = ProcessType & ProcessTypeRelations;
