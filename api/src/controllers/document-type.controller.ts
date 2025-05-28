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
import {DocumentType} from '../models';
import {DocumentTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class DocumentTypeController {
  constructor(
    @repository(DocumentTypeRepository)
    public documentTypeRepository: DocumentTypeRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
  })
  @post('/document-types')
  @response(200, {
    description: 'DocumentType model instance',
    content: {'application/json': {schema: getModelSchemaRef(DocumentType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, {
            title: 'NewDocumentType',
            exclude: ['id'],
          }),
        },
      },
    })
    documentType: Omit<DocumentType, 'id'>,
  ): Promise<DocumentType> {
    return this.documentTypeRepository.create(documentType);
  }

  @get('/document-types')
  @response(200, {
    description: 'Array of DocumentType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DocumentType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(DocumentType) filter?: Filter<DocumentType>,
  ): Promise<DocumentType[]> {
    return this.documentTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/document-types/{id}')
  @response(200, {
    description: 'DocumentType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DocumentType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DocumentType, {exclude: 'where'})
    filter?: FilterExcludingWhere<DocumentType>,
  ): Promise<DocumentType> {
    return this.documentTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @patch('/document-types/{id}')
  @response(204, {
    description: 'DocumentType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, {partial: true}),
        },
      },
    })
    documentType: DocumentType,
  ): Promise<void> {
    await this.documentTypeRepository.updateById(id, documentType);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @del('/document-types/{id}')
  @response(204, {
    description: 'DocumentType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.documentTypeRepository.deleteById(id);
  }
}
