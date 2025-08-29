import { Entity, hasMany, model, property, belongsTo} from '@loopback/repository';
import { Member } from './member.model';
import {Escalation} from './escalation.model';

@model()
export class Levels extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name: string;

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

  @hasMany(() => Member, {keyTo: 'levelId'})
  members: Member[];

  @belongsTo(() => Escalation)
  escalationId: number;

  constructor(data?: Partial<Levels>) {
    super(data);
  }
}

export interface LevelsRelations {
  // describe navigational properties here
}

export type LevelsWithRelations = Levels & LevelsRelations;
