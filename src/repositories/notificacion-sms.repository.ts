import {Llaves} from '../config/llaves';
import {NotificacionSms} from '../models/notificacion-sms.model';
const fetch = require("node-fetch");

export class NotificacionSmsRepository {
  constructor() {
  }

  EnviarSMS(notificacion: NotificacionSms): Boolean {
    let url = `${Llaves.urlServicioNotificaciones}/sms?hash=${Llaves.hash_notificaciones}&telefono=${notificacion.destino}&mensaje=${notificacion.contenido}`;
    fetch(url)
      .then(()=> true)
    return false;
  }
}
