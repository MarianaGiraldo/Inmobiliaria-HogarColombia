import {Llaves} from '../config/llaves';
import {NotificacionCorreo} from '../models';
const fetch = require("node-fetch");
const generador = require("password-generator");
const cryptoJS = require("crypto-js");

export class NotificacionCorreoRepository {
  constructor() {

  }

  GenerarClave() {
    let clave = generador(8, false)
    return clave
  }
  CifrarClave(clave: string){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;}

  EnviarCorreo(notificacion: NotificacionCorreo): Boolean {
    let url = `${Llaves.urlServicioNotificaciones}/envio-correo?hash=${Llaves.hash_notificaciones}&correo-destino=${notificacion.destinatario}&asunto=${notificacion.asunto}&contenido=${notificacion.mensaje}`;
    fetch(url)
      .then(()=> true)
    return false;
  }

}
