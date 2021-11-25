import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {Rol} from '../models/rol.model';
import {Usuario} from '../models/usuario.model';
import {UsuarioRepository} from '../repositories/usuario.repository';


export class UsuarioRolController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/rol', {
    responses: {
      '200': {
        description: 'Rol belonging to Usuario',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rol)},
          },
        },
      },
    },
  })
  async getRol(
    @param.path.string('id') id: typeof Usuario.prototype.id,
  ): Promise<Rol> {
    return this.usuarioRepository.tieneRol(id);
  }
}
