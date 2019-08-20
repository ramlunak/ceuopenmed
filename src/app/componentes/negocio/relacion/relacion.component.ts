import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NegEntidadService } from '../../../services/negocio/neg-Entidad.service';
import { NegEntidad } from 'src/app/models/negocio/neg-Entidad';

import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-relacion',
  templateUrl: './relacion.component.html',
  styleUrls: ['./relacion.component.css']
})
export class RelacionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
