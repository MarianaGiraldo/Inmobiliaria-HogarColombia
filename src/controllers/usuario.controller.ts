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
import {NotificacionCorreo} from '../models';
import {CredencialesCambioContrasena} from '../models/credenciales-cambio-contrasena.model';
import {Credenciales} from '../models/credenciales.model';
import {NotificacionSms} from '../models/notificacion-sms.model';
import {CredencialesRecuperarContrasena} from '../models/credenciales-recuperar-contrasena.model';
import {Usuario} from '../models/usuario.model';
import {NotificacionCorreoRepository} from '../repositories/notificacion-correo.repository';
import {NotificacionSmsRepository} from '../repositories/notificacion-sms.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,

    @repository(NotificacionCorreoRepository)
    public notificacionCorreoRepo : NotificacionCorreoRepository,

    @repository(NotificacionSmsRepository)
    public notificacionSMSRepo : NotificacionSmsRepository,

  ) {}

  @post('/usuarios')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, 'id'>,
  ): Promise<Usuario> {
    let clave = this.notificacionCorreoRepo.GenerarClave();
    console.log(clave)
    let claveCifrada = this.notificacionCorreoRepo.CifrarClave(clave);
    usuario.contrasena = claveCifrada;
    let p =  await this.usuarioRepository.create(usuario);
    console.log(p)

    //Notificar al usuario
    let notificacion = new NotificacionCorreo();
    notificacion.destinatario = usuario.email;
    notificacion.asunto = "Registro en el sistema";
    notificacion.mensaje = `Hola ${usuario.nombre}.<br/> Su nombre de usuario es: ${usuario.email} y su contraseña es: ${clave} `;
    this.notificacionCorreoRepo.EnviarCorreo(notificacion);

    //Notificar al usuario de la nueva contrasena por mensaje de texto
    let notificacion2 = new NotificacionSms();
    notificacion2.destino = usuario.celular;
    notificacion2.contenido = `Hola ${usuario.nombre}. Su nueva contraseña es: ${clave} `;
    this.notificacionSMSRepo.EnviarSMS(notificacion2);

    return p;
  }

  @get('/usuarios/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuarios')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuarios')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuarios/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuarios/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuarios/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }

  /*
   Sección de Seguridad
  */

  @post("/identificar-usuario",{
     responses: {
       '200':{
         description: "Identificación de usuarios"
       }
     }
  } )
  async identificar(
     @requestBody() credenciales: Credenciales
   ): Promise<Usuario | null> {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: credenciales.usuario,
        contrasena: credenciales.contrasena
      }
    });
    if(usuario) {
      usuario.contrasena="";
      //Generar nuevo token
      //que se asignará a la respuesta del usuario
    }

    return usuario
  }

  @post("/recuperar-contrasena",{
    responses: {
      '200':{
        description: "Recuperación de contrasena de usuarios"
      }
    }
  } )
  async recuperarClave(
    @requestBody() datos :CredencialesRecuperarContrasena
  ): Promise<Boolean> {
   let usuario = await this.usuarioRepository.findOne({
     where: {
       email: datos.correo
     }
   });
   if(usuario) {
    let clave = this.notificacionCorreoRepo.GenerarClave();
    console.log(clave)
    let claveCifrada = this.notificacionCorreoRepo.CifrarClave(clave);
    usuario.contrasena = claveCifrada;
    await this.usuarioRepository.updateById(usuario.id, usuario)

    //Notificar al usuario de la nueva contrasena por mensaje de texto
    let notificacion = new NotificacionSms();
    notificacion.destino = usuario.celular;
    notificacion.contenido = `Hola ${usuario.nombre}. Su nueva contraseña es: ${clave} `;
    this.notificacionSMSRepo.EnviarSMS(notificacion);
    return true
    }
   return false
  }

  @post("/cambiar-contrasena",{
    responses: {
      '200':{
        description: "Recuperación de contrasena de usuarios"
      }
    }
  } )
  async cambiarClave(
    @requestBody() datos : CredencialesCambioContrasena
  ): Promise<Boolean> {
   let usuario = await this.usuarioRepository.findById(datos.id)
   if(usuario) {
    if(usuario.contrasena == datos.clave_actual){
      let claveCifrada = datos.clave_nueva; //Clave nueva ya viene cifrada
      usuario.contrasena = claveCifrada;
      await this.usuarioRepository.updateById(datos.id, usuario);

      //Notificar al usuario
      let notificacion = new NotificacionCorreo();
      notificacion.destinatario = usuario.email;
      notificacion.asunto = "Cambio de Contrasena";
      notificacion.mensaje = `Hola ${usuario.nombre}.<br/> Su contraseña ha sido cambiada exitosamente.`;
      this.notificacionCorreoRepo.EnviarCorreo(notificacion);

      return true;
    } else {
      return false;
    }
    }
   return false
  }

}
