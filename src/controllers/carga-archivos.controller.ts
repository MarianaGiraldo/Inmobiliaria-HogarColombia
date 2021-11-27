// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  param,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import { Llaves } from '../config/llaves';
import {Fotos} from '../models';
import {FotosRepository} from '../repositories/fotos.repository';
const multer = require('multer');
const path = require('path');

export class CargaArchivosController {
  constructor(
    @repository(FotosRepository)
    private fotosRepository: FotosRepository,
  ) {}

  /**
   * @param response
   * @param request
   */
  @post('/CargarImagenInmueble/{inmuebleId}',{
    responses: {
      200: {
        content: {
          'application/json' : {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Función de la carga de imágenes del inmueble'
      }
    }
  } )
  async cargarImagenInmueble(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @param.path.string('inmuebleId') inmuebleId: string,
    @requestBody.file() request: Request,
  ): Promise<object | false>{
    const rutaImagen = path.join(__dirname, Llaves.carpetaImagenInmueble);
    let res = await this.StoreFileToPath(rutaImagen, Llaves.nombreCampoImagenInmueble, request, response, Llaves.extensionesPermitidasIMG, inmuebleId);
    if(res){
      const nombre_archivo = response.req?.file?.filename;
      if(nombre_archivo) {
        return {filename: nombre_archivo,
                inmuebleId: inmuebleId};
      }
    }
    return res;
  }


  /**
   * store the file in a specific path
   * @param storePath
   * @param request
   * @param response
   */
   private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[], inmuebleId:string): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (_req: any, file: any, callback: any) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('This format file is not supported.'));
        },
        limits: {
          fileSize: Llaves.tamMaxImagenInmueble
        }
      },
      ).single(fieldname);
      upload(request, response, (err: any) => {
        let foto = new Fotos();
        foto.nombre = response.req?.file?.filename;
        foto.inmuebleId = inmuebleId;
        this.fotosRepository.create(foto);
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  /**
   * Return a config for multer storage
   * @param path
   */
   private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, path);
      },
      filename: (req: any, file: any, cb: any) => {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      }
    });
    return storage;
  }


}
