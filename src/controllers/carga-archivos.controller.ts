// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings
} from '@loopback/rest';
import { Llaves } from '../config/llaves';
const multer = require('multer');
const path = require('path');

export class CargaArchivosController {
  constructor() {}

  /**
   * @param response
   * @param request
   */
  @post('/CargarImagenInmueble',{
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
    @requestBody.file() request: Request,
  ): Promise<object | false>{
    const rutaImagen = path.join(__dirname, Llaves.carpetaImagenInmueble);
    let res = await this.StoreFileToPath(rutaImagen, Llaves.nombreCampoImagenInmueble, request, response, Llaves.extensionesPermitidasIMG);
    if(res){
      const nombre_archivo = response.req?.file?.filename;
      if(nombre_archivo) {
        return {filename: nombre_archivo};
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
   private StoreFileToPath(storePath: string, fieldname: string, request: Request, response: Response, acceptedExt: string[]): Promise<object> {
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
      destination: function (req: any, file: any, cb: any) {
        cb(null, path)
      },
      filename: function (req: any, file: any, cb: any) {
        filename = `${Date.now()}-${file.originalname}`
        cb(null, filename);
      }
    });
    return storage;
  }


}
