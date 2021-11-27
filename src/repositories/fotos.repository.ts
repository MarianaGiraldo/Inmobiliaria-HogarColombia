import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Fotos, FotosRelations, Inmueble} from '../models';
import {InmuebleRepository} from './inmueble.repository';

export class FotosRepository extends DefaultCrudRepository<
  Fotos,
  typeof Fotos.prototype.id,
  FotosRelations
> {

  public readonly inmueble: BelongsToAccessor<Inmueble, typeof Fotos.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('InmuebleRepository') protected inmuebleRepositoryGetter: Getter<InmuebleRepository>,
  ) {
    super(Fotos, dataSource);
    this.inmueble = this.createBelongsToAccessorFor('inmueble', inmuebleRepositoryGetter,);
    this.registerInclusionResolver('inmueble', this.inmueble.inclusionResolver);
  }
}
