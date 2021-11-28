import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Asesor, AsesorRelations, Inmueble, Admin} from '../models';
import {InmuebleRepository} from './inmueble.repository';
import {AdminRepository} from './admin.repository';

export class AsesorRepository extends DefaultCrudRepository<
  Asesor,
  typeof Asesor.prototype.id,
  AsesorRelations
> {

  public readonly inmuebles: HasManyRepositoryFactory<Inmueble, typeof Asesor.prototype.id>;

  public readonly admin: BelongsToAccessor<Admin, typeof Asesor.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('InmuebleRepository') protected inmuebleRepositoryGetter: Getter<InmuebleRepository>, @repository.getter('AdminRepository') protected adminRepositoryGetter: Getter<AdminRepository>,
  ) {
    super(Asesor, dataSource);
    this.admin = this.createBelongsToAccessorFor('admin', adminRepositoryGetter,);
    this.registerInclusionResolver('admin', this.admin.inclusionResolver);
    this.inmuebles = this.createHasManyRepositoryFactoryFor('inmuebles', inmuebleRepositoryGetter,);
    this.registerInclusionResolver('inmuebles', this.inmuebles.inclusionResolver);
  }
}
