import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Cliente, NotificacionCorreo} from '../models';
import {NotificacionSms} from '../models/notificacion-sms.model';
import {ClienteRepository} from '../repositories';
import {NotificacionCorreoRepository} from '../repositories/notificacion-correo.repository';
import {NotificacionSmsRepository} from '../repositories/notificacion-sms.repository';

export class ClienteController {
  constructor(
    @repository(ClienteRepository)
    public clienteRepository : ClienteRepository,

    @repository(NotificacionCorreoRepository)
    public notificacionCorreoRepo : NotificacionCorreoRepository,

    @repository(NotificacionSmsRepository)
    public notificacionSMSRepo : NotificacionSmsRepository,

    //No lee servicios
    // @service(NotificacionService)
    // public servicioNotificaciones = NotificacionService,

    // @service(ManejoClavesService)
    // public servicioClaves = ManejoClavesService
  ) {}

  @post('/clientes')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    // let clave = this.servicioClaves.GenerarClave();
    // let claveCifrada = this.servicioClaves.CifrarClave(clave);

    // No reconoce el método desde el servicio. Se puso la función en un repositorio
    let clave = this.notificacionCorreoRepo.GenerarClave();
    let claveCifrada = this.notificacionCorreoRepo.CifrarClave(clave);
    cliente.contrasena = claveCifrada;
    let p =  await this.clienteRepository.create(cliente);
    console.log(p)

    //Notificar al usuario
    let notificacion = new NotificacionCorreo();
    notificacion.destinatario = cliente.email;
    notificacion.asunto = "Registro en el sistema";
    notificacion.mensaje = `Hola ${cliente.nombre}.<br/> Su nombre de usuario es: ${cliente.email} y su contraseña es: ${clave} `;
    //this.servicioNotificaciones.EnviarCorreo(notificacion);
    // No reconoce el método desde el servicio. se puso la función en un repositorio
    this.notificacionCorreoRepo.EnviarCorreo(notificacion);


    return p;
  }

  @get('/clientes/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.clienteRepository.find(filter);
  }

  @patch('/clientes')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }

  @get('/clientes/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }
}
