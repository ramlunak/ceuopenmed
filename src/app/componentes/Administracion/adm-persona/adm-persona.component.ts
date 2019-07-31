import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { AdmPersona } from '../../../models/Administracion/adm-persona';
import { AdmPersonaService } from '../../../services/administracion/adm-persona.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-adm-persona',
  templateUrl: './adm-persona.component.html',
  styleUrls: ['./adm-persona.component.less']
})
export class AdmPersonaComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nueva Persona';

  // DataTable --
  displayedColumns = ['IdPersona', 'PrimerNombre', 'SegundoNombre', 'ApellidoPaterno', 'ApellidoMaterno', 'commands'];
  dataSource: MatTableDataSource<AdmPersona>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private personaService: AdmPersonaService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
  }

  CargarDgvElements() {
    this.personaService.getPersonas().subscribe(result => {
      this.dataSource = new MatTableDataSource<AdmPersona>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    const formData = this.personaService.form.value;

    if (this.transaccionIsNew) {
      this.personaService.setPersona(formData.PrimerNombre, formData.SegundoNombre, formData.ApellidoPaterno, formData.ApellidoMaterno)
        .subscribe(result => {

          if (result.status === 1) {
            this.CargarDgvElements();
          } else {
            this.errorService.handleError(result.error);
          }

        }, (error) => {
          this.errorService.handleError(error);
        });
    } else {
      this.personaService.updatePersona(formData.IdPersona, formData.PrimerNombre, formData.SegundoNombre,
        formData.ApellidoPaterno, formData.ApellidoMaterno).subscribe(result => {

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
    const formData = this.personaService.form.value;
    this.personaService.deletePersona(formData.IdPersona).subscribe(result => {

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
    const persona = this.dataSource.data[this.ROW_NUMBER];
    this.personaService.form.patchValue({
      IdPersona: persona.IdPersona, PrimerNombre: persona.PrimerNombre,
      SegundoNombre: persona.SegundoNombre, ApellidoPaterno: persona.ApellidoPaterno, ApellidoMaterno: persona.ApellidoMaterno
    });
    this.dialogTittle = 'Modificar Persona';
  }

  Limpiar() {
    this.transaccionIsNew = true;
    this.personaService.form.reset();
    this.personaService.InicializarValoresFormGroup();
    this.dialogTittle = 'Nueva Persona';
  }

}
