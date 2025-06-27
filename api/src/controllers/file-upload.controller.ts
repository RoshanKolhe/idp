import { inject } from '@loopback/core';
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
import { promisify } from 'util';
import { FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY } from '../keys';
import { FileUploadHandler } from '../types';

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export class FileUploadController {
  constructor(
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  slugify(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // replace non-alphanumeric with hyphens
      .replace(/-+/g, '-')         // remove multiple hyphens
      .replace(/^-|-$/g, '');      // trim hyphens
  }

  private async uploadToFolder(
    processId: string,
    request: Request,
    response: Response,
  ): Promise<object> {
    const slug = processId ? this.slugify(processId) : '';
    const uploadDir = path.resolve(this.storageDirectory, slug);

    if (!uploadDir.startsWith(this.storageDirectory)) {
      throw new HttpErrors.BadRequest('Invalid folder path');
    }

    if (!fs.existsSync(uploadDir)) {
      // fs.mkdirSync(uploadDir, { recursive: true });
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

    const handler = multer({ storage }).any();

    return new Promise<object>((resolve, reject) => {
      handler(request, response, (err: unknown) => {
        if (err) {
          reject(new HttpErrors.InternalServerError('Upload failed'));
        } else {
          resolve(FileUploadController.getFilesAndFields(request, slug));
        }
      });
    });
  }

  @post('/files/{processId}')
  async uploadWithProcessId(
    @param.path.string('processId') processId: string,
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return this.uploadToFolder(processId, request, response);
  }

  @post('/files')
  async uploadToRoot(
    @requestBody.file() request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return this.uploadToFolder('', request, response);
  }


  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  // private static getFilesAndFields(request: Request) {
  //   const uploadedFiles = request.files;
  //   const mapper = (f: globalThis.Express.Multer.File) => {
  //     console.log('file', f);
  //     return {
  //       fieldname: f.fieldname,
  //       fileName: f.originalname,
  //       newFileName: f.filename,
  //       fileUrl: `${process.env.API_ENDPOINT}/files/${f.filename}`, // Use f.filename instead of f.originalname
  //       encoding: f.encoding,
  //       mimetype: f.mimetype,
  //       size: f.size,
  //     };
  //   };
  //   let files: object[] = [];
  //   if (Array.isArray(uploadedFiles)) {
  //     files = uploadedFiles.map(mapper);
  //   } else {
  //     for (const filename in uploadedFiles) {
  //       files.push(...uploadedFiles[filename].map(mapper));
  //     }
  //   }

  //   return {files, fields: request.body};
  // }

  @get('/files', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFiles() {
    const files = await readdir(this.storageDirectory);
    return files;
  }

  @get('/files/{folderName}', {
    responses: {
      200: {
        content: {
          // string[]
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        description: 'A list of files',
      },
    },
  })
  async listFolderFiles(
    @param.path.string('folderName') folderName: string,
  ) {
    const folderPath = path.resolve(this.storageDirectory, folderName);

    // Security check to prevent directory traversal
    if (!folderPath.startsWith(this.storageDirectory)) {
      throw new HttpErrors.BadRequest('Invalid folder path');
    }

    if (!fs.existsSync(folderPath)) {
      throw new HttpErrors.NotFound(`Folder "${folderName}" not found`);
    }

    const files = await readdir(folderPath);
    return files;

  }

  @get('/files/file/:path/:fileName')
  @oas.response.file()
  downloadFile(
    @param.path.string('path') folderPath: string,
    @param.path.string('fileName') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(`${folderPath}/${fileName}`);
    fs.readFile(file, function (err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Something Went Wrong');
      } else {
        response.writeHead(200);
        response.end(data);
      }
    });
    return response;
  }

  @get('/files/file/:fileName')
  @oas.response.file()
  downloadFileOutsideFolder(
    @param.path.string('fileName') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const file = this.validateFileName(fileName);
    fs.readFile(file, function (err, data) {
      if (err) {
        response.writeHead(404);
        response.end('Something Went Wrong');
      } else {
        response.writeHead(200);
        response.end(data);
      }
    });
    return response;
  }


  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private validateFileName(filePath: string): string {
    const resolved = path.resolve(this.storageDirectory, filePath);

    if (!resolved.startsWith(this.storageDirectory)) {
      throw new HttpErrors.BadRequest(`Invalid file path: ${filePath}`);
    }

    if (!fs.existsSync(resolved)) {
      throw new HttpErrors.NotFound('File not found');
    }

    return resolved;
  }

  private static getFilesAndFields(request: Request, slug: string = '') {
    const uploadedFiles = request.files;
    const mapper = (f: Express.Multer.File) => ({
      fieldname: f.fieldname,
      fileName: f.originalname,
      newFileName: f.filename,
      fileUrl: `${process.env.API_ENDPOINT}/files/file?path=${encodeURIComponent(slug ? slug + '/' + f.filename : f.filename)}`,
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

    return { files, fields: request.body };
  }
}
