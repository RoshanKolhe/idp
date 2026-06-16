import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { ProcessInstanceTransactionDocument } from '../models';
import { ProcessInstanceTransactionDocumentRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class ProcessInstanceTransactionDocumentController {
  constructor(
    @repository(ProcessInstanceTransactionDocumentRepository)
    public processInstanceTransactionDocumentRepository: ProcessInstanceTransactionDocumentRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @post('/process-instance-transaction-documents')
  @response(200, {
    description: 'ProcessInstanceTransactionDocument model instance',
    content: {
      'application/json': { schema: getModelSchemaRef(ProcessInstanceTransactionDocument) },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceTransactionDocument, {
            title: 'NewProcessInstanceTransactionDocument',
            exclude: ['id'],
          }),
        },
      },
    })
    data: Omit<ProcessInstanceTransactionDocument, 'id'>,
  ): Promise<ProcessInstanceTransactionDocument> {
    return this.processInstanceTransactionDocumentRepository.create(data);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-transaction-documents/count')
  @response(200, {
    description: 'ProcessInstanceTransactionDocument model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(ProcessInstanceTransactionDocument)
    where?: Where<ProcessInstanceTransactionDocument>,
  ): Promise<Count> {
    return this.processInstanceTransactionDocumentRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-transaction-documents')
  @response(200, {
    description: 'Array of ProcessInstanceTransactionDocument model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstanceTransactionDocument, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessInstanceTransactionDocument)
    filter?: Filter<ProcessInstanceTransactionDocument>,
  ): Promise<ProcessInstanceTransactionDocument[]> {
    return this.processInstanceTransactionDocumentRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-transaction-documents/{id}')
  @response(200, {
    description: 'ProcessInstanceTransactionDocument model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessInstanceTransactionDocument, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProcessInstanceTransactionDocument, { exclude: 'where' })
    filter?: FilterExcludingWhere<ProcessInstanceTransactionDocument>,
  ): Promise<ProcessInstanceTransactionDocument> {
    return this.processInstanceTransactionDocumentRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @del('/process-instance-transaction-documents/{id}')
  @response(204, {
    description: 'ProcessInstanceTransactionDocument DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processInstanceTransactionDocumentRepository.deleteById(id);
  }

  // Get all documents (with file details) for a given transaction
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.SUPER_ADMIN] },
  })
  @get('/process-instance-transaction-documents/by-transaction/{transactionId}')
  @response(200, {
    description: 'Documents linked to a specific transaction',
    content: { 'application/json': { schema: { type: 'object' } } },
  })
  async findByTransaction(
    @param.path.number('transactionId') transactionId: number,
  ): Promise<{
    success: boolean;
    message: string;
    data: ProcessInstanceTransactionDocument[];
  }> {
    const records = await this.processInstanceTransactionDocumentRepository.find({
      where: { processInstanceTransactionsId: transactionId, isDeleted: false },
      include: [
        { relation: 'processInstanceFile' },
        { relation: 'processInstanceTransactions' },
      ],
    });
    return {
      success: true,
      message: 'Transaction documents',
      data: records,
    };
  }
}
