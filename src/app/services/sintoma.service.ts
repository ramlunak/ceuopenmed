import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SintomaDetalleModel } from '../models/sintoma-detalle-model';


@Injectable({
  providedIn: 'root'
})
export class SintomaService {

  constructor() { }

  sintomasDetalle: SintomaDetalleModel[] = [{
    id: 1,
    id_entidad: 1,
    id_especialidad: 1,
    id_profesor: 1,
    nombre_profesor: 'Dr. Fulano Perez',
    sintoma: 'Fiebre',
    estado: true,
    nota: false,
    comentario: 'Esperando'
  }, {
    id: 1,
    id_entidad: 1,
    id_especialidad: 1,
    id_profesor: 1,
    nombre_profesor: 'Dr. Polanco Perez',
    sintoma: 'bla bla',
    estado: false,
    nota: false,
    comentario: 'Esperando'
  }]

  public getDetallesAll() {
    return this.sintomasDetalle;
  }

  addDetalle() {
    this.sintomasDetalle.push({
      id: 1,
      id_entidad: 1,
      id_especialidad: 1,
      id_profesor: 1,
      nombre_profesor: 'Dr. Polanco Perez',
      sintoma: 'bla bla',
      estado: false,
      nota: false,
      comentario: 'Esperando'
    });
  }

  deleteDetalle(id) {
     this.sintomasDetalle.pop();
  }

}
