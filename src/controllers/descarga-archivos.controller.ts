import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,

  HttpErrors, oas,
  param,
  Response,
  RestBindings
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Fotos} from '../models/fotos.model';
import {FotosRepository} from '../repositories/fotos.repository';
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

/**
 * A controller to handle file downloads using multipart/form-data media type
 */
 export class DescargaArchivosController {
  constructor(
    @repository(FotosRepository)
    private fotosRepository: FotosRepository,

  ) {}

  /**
   *
   * @param type
   * @param id
   */
  @get('/archivos/{type}', {
    responses: {
      200: {
        content: {
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
  async listFiles(
    @param.path.number('type') type: number,) {
    const folderPath = this.GetFolderPathByType(type);
    const files = await readdir(folderPath);
    return files;
  }

  /**
   *
   * @param type
   * @param filename
   * @param response
   */
  @get('/archivos/{type}/{filename}')
  @oas.response.file()
  async downloadFile(
    @param.path.number('type') type: number,
    @param.path.string('filename') filename: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ) {
    const folder = this.GetFolderPathByType(type);
    const fileName = await this.GetFilenameById(type, filename);
    const file = this.ValidateFileName(folder, fileName);
    response.download(file, fileName);
    return response;
  }

  /**
   * Get the folder when files are uploaded by type
   * @param type
   */
  private GetFolderPathByType(type: number) {
    let filePath = '';
    switch (type) {
      case 1:
        filePath = path.join(__dirname, Llaves.carpetaImagenInmueble);
        break;
    }
    return filePath;
  }

  /**
   *
   * @param type
   */
  private async GetFilenameById(type: number, recordId: string) {
    let fileName = '';
    switch (type) {
      case 1:
        const fotos: Fotos = await this.fotosRepository.findById(recordId);
        fileName = fotos.nombre ?? '';
        break;

    }
    return fileName;
  }

  /**
   * Validate file names to prevent them goes beyond the designated directory
   * @param fileName - File name
   */
  private ValidateFileName(folder: string, fileName: string) {
    const resolved = path.resolve(folder, fileName);
    if (resolved.startsWith(folder)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors[400](`Nombre de archivo inválido: ${fileName}`);
  }

}
