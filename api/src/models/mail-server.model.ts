import { Entity, model, property } from '@loopback/repository';

@model()
export class MailServer extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true, // MySQL will auto-increment it
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  smtpServer: string;

  @property({
    type: 'number',
    required: true,
  })
  port: number;

  @property({
    type: 'string',
    required: true,
  })
  securityProtocol: string;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  senderEmail: string;

  @property({
    type: 'string',
    required: true,
  })
  testEmailAddress: string;


  constructor(data?: Partial<MailServer>) {
    super(data);
  }
}

export interface MailServerRelations {
  // describe navigational properties here
}

export type MailServerWithRelations = MailServer & MailServerRelations;
