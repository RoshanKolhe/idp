import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Levels>) {
    super(data);
  }
}

export interface LevelsRelations {
  // describe navigational properties here
}

export type LevelsWithRelations = Levels & LevelsRelations;
