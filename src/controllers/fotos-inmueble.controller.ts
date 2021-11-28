import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Fotos,
  Inmueble,
} from '../models';
import {FotosRepository} from '../repositories/fotos.repository';

export class FotosInmuebleController {
  constructor(
    @repository(FotosRepository)
    public fotosRepository: FotosRepository,
  ) { }

  @get('/fotos/{id}/inmueble', {
    responses: {
      '200': {
        description: 'Inmueble belonging to Fotos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Inmueble)},
          },
        },
      },
    },
  })
  async getInmueble(
    @param.path.string('id') id: typeof Fotos.prototype.id,
  ): Promise<Inmueble> {
    return this.fotosRepository.inmueble(id);
  }
}
