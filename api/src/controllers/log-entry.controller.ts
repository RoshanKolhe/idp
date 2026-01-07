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
import { LogEntry } from '../models';
import { LogEntryRepository } from '../repositories';

export class LogEntryController {
  constructor(
    @repository(LogEntryRepository)
    public logEntryRepository: LogEntryRepository,
  ) { }

  @post('/log-entries')
  @response(200, {
    description: 'LogEntry model instance',
    content: { 'application/json': { schema: getModelSchemaRef(LogEntry) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogEntry, {
            title: 'NewLogEntry',
            exclude: ['id'],
          }),
        },
      },
    })
    logEntry: Omit<LogEntry, 'id'>,
  ): Promise<LogEntry> {
    return this.logEntryRepository.create(logEntry);
  }

  @get('/log-entries/count')
  @response(200, {
    description: 'LogEntry model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(LogEntry) where?: Where<LogEntry>,
  ): Promise<Count> {
    return this.logEntryRepository.count(where);
  }

  @get('/log-entries')
  @response(200, {
    description: 'Array of LogEntry model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(LogEntry, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(LogEntry) filter?: Filter<LogEntry>,
  ): Promise<LogEntry[]> {
    return this.logEntryRepository.find(filter);
  }

  @patch('/log-entries')
  @response(200, {
    description: 'LogEntry PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogEntry, { partial: true }),
        },
      },
    })
    logEntry: LogEntry,
    @param.where(LogEntry) where?: Where<LogEntry>,
  ): Promise<Count> {
    return this.logEntryRepository.updateAll(logEntry, where);
  }

  @get('/log-entries/{id}')
  @response(200, {
    description: 'LogEntry model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(LogEntry, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(LogEntry, { exclude: 'where' }) filter?: FilterExcludingWhere<LogEntry>
  ): Promise<LogEntry> {
    return this.logEntryRepository.findById(id, filter);
  }

  @patch('/log-entries/{id}')
  @response(204, {
    description: 'LogEntry PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LogEntry, { partial: true }),
        },
      },
    })
    logEntry: LogEntry,
  ): Promise<void> {
    await this.logEntryRepository.updateById(id, logEntry);
  }

  @put('/log-entries/{id}')
  @response(204, {
    description: 'LogEntry PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() logEntry: LogEntry,
  ): Promise<void> {
    await this.logEntryRepository.replaceById(id, logEntry);
  }

  @del('/log-entries/{id}')
  @response(204, {
    description: 'LogEntry DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.logEntryRepository.deleteById(id);
  }

  @post('/log-entries/logs-by-node')
  async logsByNode(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              processInstanceTransactionId: { type: 'number' },
              nodeName: { type: 'string' },
              limit: { type: 'number', default: 10 }, 
              skip: { type: 'number', default: 0 },    
            },
            required: ['processInstanceTransactionId', 'nodeName']
          }
        }
      }
    })
    requestBody: {
      processInstanceTransactionId: number;
      nodeName: string;
      limit?: number;
      skip?: number;
    }
  ): Promise<LogEntry[]> {
    try {
      const { processInstanceTransactionId, nodeName, limit = 10, skip = 0 } = requestBody;

      const logs = await this.logEntryRepository.find({
        where: {
          and: [
            { processInstanceTransactionId },
            { nodeName }
          ]
        },
        limit,
        skip,
        order: ['createdAt DESC'],
      });

      return logs;
    } catch (error) {
      throw error;
    }
  }
}
