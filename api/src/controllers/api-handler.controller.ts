import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  HttpErrors,
  oas,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import {STORAGE_DIRECTORY} from '../keys';
import {
  ProcessInstanceSecretsRepository,
  ProcessInstancesRepository,
} from '../repositories';
import {JWTService} from '../services/jwt-service';

const readdir = promisify(fs.readdir);

type ProcessInstanceTokenProfile = {
  processInstanceId: number;
  processInstanceName: string;
  processInstanceSecretKey: string;
  processId: number;
};

export class ApiHandlerController {
  constructor(
    @repository(ProcessInstancesRepository)
    public processInstancesRepository: ProcessInstancesRepository,
    @repository(ProcessInstanceSecretsRepository)
    public processInstanceSecretsRepository: ProcessInstanceSecretsRepository,
    @inject('service.jwt.service')
    public jwtService: JWTService,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {}

  private extractToken(request: Request): string {
    const authHeader = request.headers['authorization'];
    if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
      return authHeader.slice('bearer '.length).trim();
    }

    const headerToken = request.headers['token'];
    if (typeof headerToken === 'string' && headerToken.trim()) {
      return headerToken.trim();
    }

    const queryToken = request.query?.token;
    if (typeof queryToken === 'string' && queryToken.trim()) {
      return queryToken.trim();
    }

    throw new HttpErrors.Unauthorized('Missing token');
  }

  private async verifyAndLoadProcessInstance(request: Request): Promise<{
    profile: ProcessInstanceTokenProfile;
    folderName: string;
  }> {
    const token = this.extractToken(request);
    const profile = (await this.jwtService.verifyProcessInstanceToken(
      token,
    )) as ProcessInstanceTokenProfile;

    const secretRow = await this.processInstanceSecretsRepository.findOne({
      where: {processInstancesId: profile.processInstanceId},
    });

    if (!secretRow?.secretKey) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    if (secretRow.secretKey !== profile.processInstanceSecretKey) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }

    const processInstance = await this.processInstancesRepository.findById(
      profile.processInstanceId,
    );

    if (!processInstance?.processInstanceFolderName) {
      throw new HttpErrors.BadRequest('Process instance folder not configured');
    }

    return {profile, folderName: processInstance.processInstanceFolderName};
  }

  private resolveFolderPath(folderName: string): string {
    const resolved = path.resolve(this.storageDirectory, folderName);
    if (!resolved.startsWith(this.storageDirectory)) {
      throw new HttpErrors.BadRequest('Invalid folder path');
    }
    return resolved;
  }

  private async uploadToFolder(
    folderName: string,
    request: Request,
    response: Response,
  ): Promise<object> {
    const uploadDir = this.resolveFolderPath(folderName);

    if (!fs.existsSync(uploadDir)) {
      throw new HttpErrors.BadRequest('No such path exist');
    }

    const multer = require('multer');
    const storage = multer.diskStorage({
      destination: uploadDir,
      filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        cb(null, `${timestamp}_${file.originalname}`);
      },
    });

    const handler = multer({storage}).any();

    return new Promise<object>((resolve, reject) => {
      handler(request, response, (err: unknown) => {
        if (err) {
          reject(new HttpErrors.InternalServerError('Upload failed'));
        } else {
          resolve(ApiHandlerController.getFilesAndFields(request, folderName));
        }
      });
    });
  }

  private static getFilesAndFields(request: Request, folderName: string) {
    const uploadedFiles = request.files;
    const mapper = (f: Express.Multer.File) => ({
      fieldname: f.fieldname,
      fileName: f.originalname,
      newFileName: f.filename,
      fileUrl: `${process.env.API_ENDPOINT}/api-handler/files/${encodeURIComponent(
        folderName,
      )}/${encodeURIComponent(f.filename)}`,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });

    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }

    return {files, fields: request.body};
  }

  @get('/api-handler/verify-token')
  async verifyToken(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<object> {
    const {profile, folderName} = await this.verifyAndLoadProcessInstance(
      request,
    );

    return {
      valid: true,
      processInstanceId: profile.processInstanceId,
      processInstanceName: profile.processInstanceName,
      processId: profile.processId,
      folderName,
    };
  }

  @post('/api-handler/generate-lived-token')
  async generateLongLivedToken(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<object> {
    const {profile, folderName} = await this.verifyAndLoadProcessInstance(
      request,
    );

    const longLivedToken = await this.jwtService.generateLongLivedProcessInstanceToken(
      profile,
    );

    return {
      longLivedToken,
      folderName,
    };
  }

  @get('/api-handler/files')
  async listMyFiles(@inject(RestBindings.Http.REQUEST) request: Request) {
    const {folderName} = await this.verifyAndLoadProcessInstance(request);
    const folderPath = this.resolveFolderPath(folderName);

    if (!fs.existsSync(folderPath)) {
      throw new HttpErrors.NotFound(`Folder "${folderName}" not found`);
    }

    const files = await readdir(folderPath);
    return files;
  }

  @get('/api-handler/files/{folderName}')
  async listFiles(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.path.string('folderName') folderName: string,
  ) {
    const verified = await this.verifyAndLoadProcessInstance(request);
    if (folderName !== verified.folderName) {
      throw new HttpErrors.Forbidden('Invalid folder');
    }

    const folderPath = this.resolveFolderPath(folderName);

    if (!fs.existsSync(folderPath)) {
      throw new HttpErrors.NotFound(`Folder "${folderName}" not found`);
    }

    const files = await readdir(folderPath);
    return files;
  }

  @post('/api-handler/files/{folderName}')
  async uploadFiles(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('folderName') folderName: string,
    @requestBody.file() _body: Request,
  ): Promise<object> {
    const verified = await this.verifyAndLoadProcessInstance(request);
    if (folderName !== verified.folderName) {
      throw new HttpErrors.Forbidden('Invalid folder');
    }

    return this.uploadToFolder(folderName, request, response);
  }

  @get('/api-handler/files/{folderName}/{fileName}')
  @oas.response.file()
  downloadFile(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('folderName') folderName: string,
    @param.path.string('fileName') fileName: string,
  ) {
    const download = async () => {
      const verified = await this.verifyAndLoadProcessInstance(request);
      if (folderName !== verified.folderName) {
        throw new HttpErrors.Forbidden('Invalid folder');
      }

      const filePath = path.resolve(this.storageDirectory, folderName, fileName);
      if (!filePath.startsWith(this.storageDirectory)) {
        throw new HttpErrors.BadRequest('Invalid file path');
      }
      if (!fs.existsSync(filePath)) {
        throw new HttpErrors.NotFound('File not found');
      }

      fs.readFile(filePath, function (err, data) {
        if (err) {
          response.writeHead(404);
          response.end('Something Went Wrong');
        } else {
          response.writeHead(200);
          response.end(data);
        }
      });

      return response;
    };

    return download();
  }

  @get('/api-handler/webhook/get-info')
  async getWebhookInfo(
    @inject(RestBindings.Http.REQUEST) request: Request,
  ): Promise<object> {
    const {folderName} = await this.verifyAndLoadProcessInstance(request);

    const apiEndpoint = process.env.API_ENDPOINT ?? '';

    return {
      folderName,
      upload: {
        method: 'POST',
        url: `${apiEndpoint}/api-handler/files/${encodeURIComponent(folderName)}`,
        headers: {
          Authorization: 'Bearer <token>',
        },
        contentType: 'multipart/form-data',
      },
      list: {
        method: 'GET',
        url: `${apiEndpoint}/api-handler/files/${encodeURIComponent(folderName)}`,
        headers: {
          Authorization: 'Bearer <token>',
        },
      },
      download: {
        method: 'GET',
        urlTemplate: `${apiEndpoint}/api-handler/files/${encodeURIComponent(
          folderName,
        )}/<fileName>`,
        headers: {
          Authorization: 'Bearer <token>',
        },
      },
    };
  }
}
