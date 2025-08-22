import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Levels} from './levels.model';

@model()
export class Member extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  fullName: string;

  @property({
    type: 'object',
  })
 avatarUrl: object;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'string',
  })
  phoneNumber: string;


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
  
  @belongsTo(() => Levels)
  levelsId: number;

  constructor(data?: Partial<Member>) {
    super(data);
  }
}

export interface MemberRelations {
  // describe navigational properties here
}

export type MemberWithRelations = Member & MemberRelations;
