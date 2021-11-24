import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");

@injectable({scope: BindingScope.TRANSIENT})
export class ManejoClavesService {
  static GenerarClave() {
    let clave = generador(8, false)
    return clave
  }
  static CifrarClave(clave: string){
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;}
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  
}
