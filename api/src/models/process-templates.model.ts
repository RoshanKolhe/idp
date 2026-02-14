import { Entity, model, property, belongsTo} from '@loopback/repository';
import {Processes} from './processes.model';

@model()
export class ProcessTemplates extends Entity {
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
  name: string;

  @property({
    type: 'object',
    required: true
  })
  image: object;

  @property({
    type: 'string',
    required: false
  })
  description?: string;

  @property({
    type: 'string',
    required: false
  })
  requirements?: string;

  @property({
    type: 'string',
    required: true
  })
  version: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [
        'draft',
        'published',
        'unpublished'
      ]
    }
  })
  status: boolean;

  @property({
    type: 'string',
  })
  otp?: string;

  @property({
    type: 'string',
  })
  fcmToken?: string;

  @property({
    type: 'string',
  })
  otpExpireAt: string;

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

  @belongsTo(() => Processes)
  processesId: number;

  constructor(data?: Partial<ProcessTemplates>) {
    super(data);
  }
}

export interface ProcessTemplatesRelations {
  // describe navigational properties here
}

export type ProcessTemplatesWithRelations = ProcessTemplates & ProcessTemplatesRelations;
