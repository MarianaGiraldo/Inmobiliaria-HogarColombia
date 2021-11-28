import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Asesor,
  Admin,
} from '../models';
import {AsesorRepository} from '../repositories';

export class AsesorAdminController {
  constructor(
    @repository(AsesorRepository)
    public asesorRepository: AsesorRepository,
  ) { }

  @get('/asesors/{id}/admin', {
    responses: {
      '200': {
        description: 'Admin belonging to Asesor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Admin)},
          },
        },
      },
    },
  })
  async getAdmin(
    @param.path.string('id') id: typeof Asesor.prototype.id,
  ): Promise<Admin> {
    return this.asesorRepository.admin(id);
  }
}
