import {AuthenticationStrategy} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Request} from 'express';
import parseBearerToken from 'parse-bearer-token';
import {Llaves} from '../config/llaves';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {SesionUsuarioService} from '../services/sesion-usuario.service';

export class EstrategiaCliente implements AuthenticationStrategy {
  name: string = "cliente";
  private sesionUsuariosService : SesionUsuarioService

  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
  ) {
  this.sesionUsuariosService = new SesionUsuarioService(this.usuarioRepository)
  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      //validar token
      let r = await this.sesionUsuariosService.ValidarToken(token, Llaves.rol_cliente)
      switch (r) {
        case "OK":
          let perfil: UserProfile = Object.assign({
                cliente: "OK"
              });
              return perfil;
        case "KO":
          throw new HttpErrors[401]("El rol del token no es valido")
        case "":
          throw new HttpErrors[401]("El token incluido no es valido");
      }
    }else{
      throw new HttpErrors[401]("No se ha incluido un token en la solicitud")
    }
  }

}
