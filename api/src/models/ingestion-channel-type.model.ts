import {Entity, model, property} from '@loopback/repository';

@model()
export class IngestionChannelType extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  channelType: string;

  @property({
    type: 'string',
    required: true
  })
  channelValue: string;

  @property({
    type: 'string'
  })
  description: string;

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
  constructor(data?: Partial<IngestionChannelType>) {
    super(data);
  }
}

export interface IngestionChannelTypeRelations {
  // describe navigational properties here
}

export type IngestionChannelTypeWithRelations = IngestionChannelType & IngestionChannelTypeRelations;
