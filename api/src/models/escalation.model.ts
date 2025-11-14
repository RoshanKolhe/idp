import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Levels} from './levels.model';
import {User} from './user.model';

@model()
export class Escalation extends Entity {
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
  escalationName: string;

  @property({
    type: 'string',

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

  @hasMany(() => Levels)
  levels: Levels[];

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Escalation>) {
    super(data);
  }
}

export interface EscalationRelations {
  // describe navigational properties here
}

export type EscalationWithRelations = Escalation & EscalationRelations;
