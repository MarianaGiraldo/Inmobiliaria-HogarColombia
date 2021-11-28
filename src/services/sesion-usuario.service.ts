import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {RSA_NO_PADDING} from 'constants';
import {Llaves} from '../config/llaves';
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories/usuario.repository';
const fetch = require("node-fetch");

@injectable({scope: BindingScope.TRANSIENT})
export class SesionUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    private usuarioRepository : UsuarioRepository
  ) {}

  /*
   * Add service methods here
  */
  async ValidarCredenciales(credenciales: Credenciales) {
    let usuario = await this.usuarioRepository.findOne({
      where: {
        email: credenciales.usuario,
        contrasena: credenciales.contrasena
      }
    });
    return usuario
  }

  async CrearToken(usuario: Usuario): Promise<string>{
    let url = `${Llaves.url_crear_token}?${Llaves.arg_nombre_token}=${usuario.nombre + " " + usuario.apellidos}&${Llaves.arg_id_persona_token}=${usuario.id}&${Llaves.arg_id_rol_token}=${usuario.rolId}`;
    let token = ""
    await fetch(url)
      .then(async (res: any)=>{
        token = await res.text();
        //console.log(token)
      })
    return token;
  }

  async ValidarToken(token: string, rol: string): Promise<string>{
    let url = `${Llaves.url_validar_token}?${Llaves.arg_token}=${token}&${Llaves.arg_rol_token}=${rol}`;
    let r= ""
    await fetch(url)
      .then(async(res: any)=>{
        r = await res.text();
        console.log(r)
      })
    return r;
  }

}
