import { EstadistiasUsuarios } from './../../../models/estadisticas';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EntidadService } from 'src/app/services/entity/entidad.service';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Entidad } from 'src/app/models/entidad';

@Component({
  selector: 'app-estadisticas-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class EstadisticasUsuariosComponent implements OnInit {

  // DataTable --
  dataSource: MatTableDataSource<EstadistiasUsuarios>;
  displayedColumns = ['TipoEntidad', 'IdEntidad', 'Idioma', 'Entidad', 'Estudiante', 'info', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private Service: EntidadService,
    private authService: AuthService,
    private errorService: ErrorHandlerService,
    private router: Router, ) { }

  ngOnInit() {
    this.CargarDgvElements();
  }

  CargarDgvElements() {

    this.Service.getEstadisticasUsuarios().subscribe(result => {
      console.log(result.data);
      this.dataSource = new MatTableDataSource<EstadistiasUsuarios>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

}
