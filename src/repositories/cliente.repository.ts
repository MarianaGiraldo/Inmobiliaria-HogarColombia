import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {MongodbDataSource} from '../datasources';
import {Cliente, ClienteRelations, NotificacionCorreo, Solicitud} from '../models';
import {SolicitudRepository} from './solicitud.repository';

const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const fetch = require("node-fetch");
export class ClienteRepository extends DefaultCrudRepository<
  Cliente,
  typeof Cliente.prototype.id,
  ClienteRelations
> {

  public readonly solicitudes: HasManyRepositoryFactory<Solicitud, typeof Cliente.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>,
  ) {
    super(Cliente, dataSource);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
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
      .then((data: any)=> true)
    return false;
  }
}
