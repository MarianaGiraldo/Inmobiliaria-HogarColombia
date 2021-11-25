import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbUsuariosDataSource} from '../datasources';
import {Rol} from '../models/rol.model';
import {Usuario, UsuarioRelations} from '../models/usuario.model';
import {RolRepository} from './rol.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id,
  UsuarioRelations
> {

  public readonly tieneRol: BelongsToAccessor<Rol, typeof Usuario.prototype.id>;

  constructor(
    @inject('datasources.mongodb_usuarios') dataSource: MongodbUsuariosDataSource, @repository.getter('RolRepository') protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(Usuario, dataSource);
    this.tieneRol = this.createBelongsToAccessorFor('tieneRol', rolRepositoryGetter,);
    this.registerInclusionResolver('tieneRol', this.tieneRol.inclusionResolver);
  }
}
