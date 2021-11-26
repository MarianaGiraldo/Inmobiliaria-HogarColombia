import {Model, model, property} from '@loopback/repository';

@model()
export class CredencialesRecuperarContrasena extends Model {
  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  constructor(data?: Partial<CredencialesRecuperarContrasena>) {
    super(data);
  }
}

export interface CredencialesRecuperarContrasenaRelations {
  // describe navigational properties here
}

export type CredencialesRecuperarContrasenaWithRelations =
  CredencialesRecuperarContrasena & CredencialesRecuperarContrasenaRelations;
