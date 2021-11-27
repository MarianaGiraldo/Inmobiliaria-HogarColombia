import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Inmueble} from './inmueble.model';

@model()
export class Fotos extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre?: string;

  @belongsTo(() => Inmueble)
  inmuebleId: string;

  constructor(data?: Partial<Fotos>) {
    super(data);
  }
}

export interface FotosRelations {
  // describe navigational properties here
}

export type FotosWithRelations = Fotos & FotosRelations;
