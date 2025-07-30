import { Entity, model, property, belongsTo } from '@loopback/repository';
import { ProcessInstances } from './process-instances.model';

@model()
export class ProcessInstanceSecrets extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => ProcessInstances)
  processInstancesId: number;

  @property({
    type: 'string',
    required: true,
    index: { unique: true },
  })
  secretKey: string;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'string',
  })
  remark?: string;

  constructor(data?: Partial<ProcessInstanceSecrets>) {
    super(data);
  }
}

export interface ProcessInstanceSecretsRelations {
  // describe navigational properties here
}

export type ProcessInstanceSecretsWithRelations = ProcessInstanceSecrets & ProcessInstanceSecretsRelations;
