import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Inmueble,
  Fotos,
} from '../models';
import {InmuebleRepository} from '../repositories';

export class InmuebleFotosController {
  constructor(
    @repository(InmuebleRepository) protected inmuebleRepository: InmuebleRepository,
  ) { }

  @get('/inmuebles/{id}/fotos', {
    responses: {
      '200': {
        description: 'Array of Inmueble has many Fotos',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Fotos)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Fotos>,
  ): Promise<Fotos[]> {
    return this.inmuebleRepository.tieneFotos(id).find(filter);
  }

  @post('/inmuebles/{id}/fotos', {
    responses: {
      '200': {
        description: 'Inmueble model instance',
        content: {'application/json': {schema: getModelSchemaRef(Fotos)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Inmueble.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Fotos, {
            title: 'NewFotosInInmueble',
            exclude: ['id'],
            optional: ['inmuebleId']
          }),
        },
      },
    }) fotos: Omit<Fotos, 'id'>,
  ): Promise<Fotos> {
    return this.inmuebleRepository.tieneFotos(id).create(fotos);
  }

  @patch('/inmuebles/{id}/fotos', {
    responses: {
      '200': {
        description: 'Inmueble.Fotos PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Fotos, {partial: true}),
        },
      },
    })
    fotos: Partial<Fotos>,
    @param.query.object('where', getWhereSchemaFor(Fotos)) where?: Where<Fotos>,
  ): Promise<Count> {
    return this.inmuebleRepository.tieneFotos(id).patch(fotos, where);
  }

  @del('/inmuebles/{id}/fotos', {
    responses: {
      '200': {
        description: 'Inmueble.Fotos DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Fotos)) where?: Where<Fotos>,
  ): Promise<Count> {
    return this.inmuebleRepository.tieneFotos(id).delete(where);
  }
}
