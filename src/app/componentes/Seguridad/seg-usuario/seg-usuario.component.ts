import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SegUsuarioService } from '../../../services/seguridad/seg-usuario.service';
import { SegUsuario } from 'src/app/models/Seguridad/seg-usuario';
import { AdmPersonaService } from 'src/app/services/administracion/adm-persona.service';
import { AdmPersona } from 'src/app/models/Administracion/adm-persona';
import { SegRolService } from 'src/app/services/seguridad/seg-rol.service';
import { SegRol } from 'src/app/models/Seguridad/seg-rol';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';


@Component({
  selector: 'app-seg-usuario',
  templateUrl: './seg-usuario.component.html',
  styleUrls: ['./seg-usuario.component.css']
})
export class SegUsuarioComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Usuario';

  // DataTable --
  dataSource: MatTableDataSource<SegUsuario>;
  displayedColumns = ['id', 'username', 'email', 'created_at', 'updated_at', 'Rol', 'NombreCompleto', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listPersonas: AdmPersona[];
  listRoles: SegRol[];

  constructor(private usuarioService: SegUsuarioService,
              private personaService: AdmPersonaService,
              private rolService: SegRolService,
              private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
    this.CargarSelects();
  }

  CargarDgvElements() {
    this.usuarioService.getUsuarios().subscribe(result => {
      this.dataSource = new MatTableDataSource<SegUsuario>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    this.personaService.getPersonas().subscribe(result => {
      this.listPersonas = result.data;
    });

    this.rolService.getRoles().subscribe(result => {
      this.listRoles = result.data;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    if (this.transaccionIsNew) {
      this.usuarioService.setUsuario().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.usuarioService.updateUsuario().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }

      }, (error) => {
        this.errorService.handleError(error);
      });
    }
    this.Limpiar();
  }

  eliminarClick() {
    this.usuarioService.deleteUsuario().subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
    this.Limpiar();
  }


  setOperationsData() {
    this.transaccionIsNew = false;
    const rol = this.dataSource.data[this.ROW_NUMBER];
    //this.usuarioService.form.patchValue({ IdUsuario: rol.id, Usuario: rol.username });
    this.dialogTittle = 'Modificar Usuario';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.usuarioService.form.reset();
    this.usuarioService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nuevo Usuario';
  }

}
