import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Inmueble, InmuebleRelations, Asesor, Solicitud, Fotos} from '../models';
import {AsesorRepository} from './asesor.repository';
import {SolicitudRepository} from './solicitud.repository';
import {FotosRepository} from './fotos.repository';

export class InmuebleRepository extends DefaultCrudRepository<
  Inmueble,
  typeof Inmueble.prototype.id,
  InmuebleRelations
> {

  public readonly asesor: BelongsToAccessor<Asesor, typeof Inmueble.prototype.id>;

  public readonly solicitudes: HasManyRepositoryFactory<Solicitud, typeof Inmueble.prototype.id>;

  public readonly tieneFotos: HasManyRepositoryFactory<Fotos, typeof Inmueble.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>, @repository.getter('SolicitudRepository') protected solicitudRepositoryGetter: Getter<SolicitudRepository>, @repository.getter('FotosRepository') protected fotosRepositoryGetter: Getter<FotosRepository>,
  ) {
    super(Inmueble, dataSource);
    this.tieneFotos = this.createHasManyRepositoryFactoryFor('tieneFotos', fotosRepositoryGetter,);
    this.registerInclusionResolver('tieneFotos', this.tieneFotos.inclusionResolver);
    this.solicitudes = this.createHasManyRepositoryFactoryFor('solicitudes', solicitudRepositoryGetter,);
    this.registerInclusionResolver('solicitudes', this.solicitudes.inclusionResolver);
    this.asesor = this.createBelongsToAccessorFor('asesor', asesorRepositoryGetter,);
    this.registerInclusionResolver('asesor', this.asesor.inclusionResolver);
  }
}
