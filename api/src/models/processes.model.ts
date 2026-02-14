import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ProcessType} from './process-type.model';
import {BluePrint} from './blue-print.model';
import {User} from './user.model';
import {ProcessTemplates} from './process-templates.model';

@model()
export class Processes extends Entity {
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
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
    required: true,
    default: false
  })
  isTemplateUsed: boolean;

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

  @belongsTo(() => ProcessType)
  processTypeId: number;

  @belongsTo(() => BluePrint)
  bluePrintId: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => ProcessTemplates)
  processTemplatesId: number;

  constructor(data?: Partial<Processes>) {
    super(data);
  }
}

export interface ProcessesRelations {
  // describe navigational properties here
}

export type ProcessesWithRelations = Processes & ProcessesRelations;
