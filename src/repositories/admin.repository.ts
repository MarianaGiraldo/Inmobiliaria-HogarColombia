import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Admin, AdminRelations, Asesor} from '../models';
import {AsesorRepository} from './asesor.repository';

export class AdminRepository extends DefaultCrudRepository<
  Admin,
  typeof Admin.prototype.id,
  AdminRelations
> {

  public readonly gestionaAsesores: HasManyRepositoryFactory<Asesor, typeof Admin.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('AsesorRepository') protected asesorRepositoryGetter: Getter<AsesorRepository>,
  ) {
    super(Admin, dataSource);
    this.gestionaAsesores = this.createHasManyRepositoryFactoryFor('gestionaAsesores', asesorRepositoryGetter,);
    this.registerInclusionResolver('gestionaAsesores', this.gestionaAsesores.inclusionResolver);
  }
}
