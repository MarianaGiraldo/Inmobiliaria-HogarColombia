import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {MongodbDataSource} from '../datasources';
import {Cliente, ClienteRelations, NotificacionCorreo, Solicitud} from '../models';
import {SolicitudRepository} from './solicitud.repository';

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

  
}
