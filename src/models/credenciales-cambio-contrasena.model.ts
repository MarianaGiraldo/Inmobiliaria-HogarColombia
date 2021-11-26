import {Model, model, property} from '@loopback/repository';

@model()
export class CredencialesCambioContrasena extends Model {
  @property({
    type: 'string',
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  clave_actual: string;

  @property({
    type: 'string',
    required: true,
  })
  clave_nueva: string;


  constructor(data?: Partial<CredencialesCambioContrasena>) {
    super(data);
  }
}

export interface CredencialesCambioContrasenaRelations {
  // describe navigational properties here
}

export type CredencialesCambioContrasenaWithRelations = CredencialesCambioContrasena & CredencialesCambioContrasenaRelations;
