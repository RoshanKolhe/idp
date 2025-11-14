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
import {FileType} from '../models';
import {FileTypeRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class FileTypeController {
  constructor(
    @repository(FileTypeRepository)
    public fileTypeRepository: FileTypeRepository,
  ) {}

  @authenticate({
    strategy: 'jwt',
  })
  @post('/file-types')
  @response(200, {
    description: 'FileType model instance',
    content: {'application/json': {schema: getModelSchemaRef(FileType)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FileType, {
            title: 'NewFileType',
            exclude: ['id'],
          }),
        },
      },
    })
    fileType: Omit<FileType, 'id'>,
  ): Promise<FileType> {
    return this.fileTypeRepository.create(fileType);
  }

  // @authenticate({
  //   strategy: 'jwt',
  // })
  @get('/file-types')
  @response(200, {
    description: 'Array of FileType model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FileType, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FileType) filter?: Filter<FileType>,
  ): Promise<FileType[]> {
    return this.fileTypeRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @get('/file-types/{id}')
  @response(200, {
    description: 'FileType model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FileType, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FileType, {exclude: 'where'})
    filter?: FilterExcludingWhere<FileType>,
  ): Promise<FileType> {
    return this.fileTypeRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @patch('/file-types/{id}')
  @response(204, {
    description: 'FileType PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FileType, {partial: true}),
        },
      },
    })
    fileType: FileType,
  ): Promise<void> {
    await this.fileTypeRepository.updateById(id, fileType);
  }

  @authenticate({
    strategy: 'jwt',
  })
  @del('/file-types/{id}')
  @response(204, {
    description: 'FileType DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.fileTypeRepository.deleteById(id);
  }
}
