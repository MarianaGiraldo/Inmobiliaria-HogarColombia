import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Inmueble, Solicitud, SolicitudRelations, Usuario} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {InmuebleRepository} from './inmueble.repository';

export class SolicitudRepository extends DefaultCrudRepository<
  Solicitud,
  typeof Solicitud.prototype.id,
  SolicitudRelations
> {
  public readonly usuario: BelongsToAccessor<
    Usuario,
    typeof Solicitud.prototype.id
  >;

  public readonly inmueble: BelongsToAccessor<
    Inmueble,
    typeof Solicitud.prototype.id
  >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
    @repository.getter('UsuarioRepository')
    protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
    @repository.getter('InmuebleRepository')
    protected inmuebleRepositoryGetter: Getter<InmuebleRepository>,
  ) {
    super(Solicitud, dataSource);
    this.inmueble = this.createBelongsToAccessorFor(
      'inmueble',
      inmuebleRepositoryGetter,
    );
    this.registerInclusionResolver('inmueble', this.inmueble.inclusionResolver);
    this.usuario = this.createBelongsToAccessorFor(
      'usuario',
      usuarioRepositoryGetter,
    );
    this.registerInclusionResolver('usuario', this.usuario.inclusionResolver);
  }
}
