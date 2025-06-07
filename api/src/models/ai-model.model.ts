import {Entity, model, property} from '@loopback/repository';

@model()
export class AiModel extends Entity {
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
  modelName: 'string';

  @property({
    type: 'string',
    required: true
  })
  modelValue: 'string';

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

  constructor(data?: Partial<AiModel>) {
    super(data);
  }
}

export interface AiModelRelations {
  // describe navigational properties here
}

export type AiModelWithRelations = AiModel & AiModelRelations;
