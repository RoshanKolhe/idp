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
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { ProcessInstanceTransactions } from '../models';
import { ProcessInstanceTransactionsRepository } from '../repositories';

export class ProcessInstanceTransactionsController {
  constructor(
    @repository(ProcessInstanceTransactionsRepository)
    public processInstanceTransactionsRepository: ProcessInstanceTransactionsRepository,
  ) { }

  @post('/process-instance-transactions')
  @response(200, {
    description: 'ProcessInstanceTransactions model instance',
    content: { 'application/json': { schema: getModelSchemaRef(ProcessInstanceTransactions) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceTransactions, {
            title: 'NewProcessInstanceTransactions',
            exclude: ['id'],
          }),
        },
      },
    })
    processInstanceTransactions: Omit<ProcessInstanceTransactions, 'id'>,
  ): Promise<ProcessInstanceTransactions> {
    return this.processInstanceTransactionsRepository.create(processInstanceTransactions);
  }

  @get('/process-instance-transactions/count')
  @response(200, {
    description: 'ProcessInstanceTransactions model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(ProcessInstanceTransactions) where?: Where<ProcessInstanceTransactions>,
  ): Promise<Count> {
    return this.processInstanceTransactionsRepository.count(where);
  }

  @get('/process-instance-transactions')
  @response(200, {
    description: 'Array of ProcessInstanceTransactions model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProcessInstanceTransactions, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(ProcessInstanceTransactions) filter?: Filter<ProcessInstanceTransactions>,
  ): Promise<ProcessInstanceTransactions[]> {
    return this.processInstanceTransactionsRepository.find(filter);
  }

  @patch('/process-instance-transactions')
  @response(200, {
    description: 'ProcessInstanceTransactions PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceTransactions, { partial: true }),
        },
      },
    })
    processInstanceTransactions: ProcessInstanceTransactions,
    @param.where(ProcessInstanceTransactions) where?: Where<ProcessInstanceTransactions>,
  ): Promise<Count> {
    return this.processInstanceTransactionsRepository.updateAll(processInstanceTransactions, where);
  }

  @get('/process-instance-transactions/{processInstanceId}')
  @response(200, {
    description: 'ProcessInstanceTransactions model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProcessInstanceTransactions, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('processInstanceId') processInstanceId: number,
    @param.filter(ProcessInstanceTransactions, { exclude: 'where' }) filter?: FilterExcludingWhere<ProcessInstanceTransactions>
  ): Promise<ProcessInstanceTransactions[]> {
    return this.processInstanceTransactionsRepository.find({...filter, where: {processInstancesId: processInstanceId}});
  }

  @patch('/process-instance-transactions/{id}')
  @response(204, {
    description: 'ProcessInstanceTransactions PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProcessInstanceTransactions, { partial: true }),
        },
      },
    })
    processInstanceTransactions: ProcessInstanceTransactions,
  ): Promise<void> {
    await this.processInstanceTransactionsRepository.updateById(id, processInstanceTransactions);
  }

  @put('/process-instance-transactions/{id}')
  @response(204, {
    description: 'ProcessInstanceTransactions PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() processInstanceTransactions: ProcessInstanceTransactions,
  ): Promise<void> {
    await this.processInstanceTransactionsRepository.replaceById(id, processInstanceTransactions);
  }

  @del('/process-instance-transactions/{id}')
  @response(204, {
    description: 'ProcessInstanceTransactions DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.processInstanceTransactionsRepository.deleteById(id);
  }
}
