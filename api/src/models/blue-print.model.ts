import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Processes} from './processes.model';

@model()
export class BluePrint extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'array',
    itemType: 'object',
    required: true
  })
  bluePrint: object[];

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

  constructor(data?: Partial<BluePrint>) {
    super(data);
  }
}

export interface BluePrintRelations {
  // describe navigational properties here
}

export type BluePrintWithRelations = BluePrint & BluePrintRelations;
