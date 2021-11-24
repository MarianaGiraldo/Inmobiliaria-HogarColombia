import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Llaves} from '../config/llaves';
import {NotificacionCorreo} from '../models';

const fetch = require("node-fetch");

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionService {

  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  EnviarCorreo(notificacion: NotificacionCorreo): Boolean {
    let url = `${Llaves.urlServicioNotificaciones}/envio-correo?hash=${Llaves.hash_notificaciones}&correo-destino=${notificacion.destinatario}&asunto=${notificacion.asunto}&contenido=${notificacion.mensaje}`;
    fetch(url)
      .then((data: any)=> true)
    return false;
  }
}
