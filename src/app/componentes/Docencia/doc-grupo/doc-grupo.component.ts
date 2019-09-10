import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocGrupoService } from '../../../services/docencia/doc-grupo.service';
import { DocGrupo } from 'src/app/models/Docencia/doc-grupo';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-doc-grupo',
  templateUrl: './doc-grupo.component.html',
  styleUrls: ['./doc-grupo.component.css']
})
export class DocGrupoComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Grupo';

  // DataTable --
  dataSource: MatTableDataSource<DocGrupo>;
  displayedColumns = ['IdGrupo', 'Grupo', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private grupoService: DocGrupoService, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();
  }

  CargarDgvElements() {
    this.grupoService.getGrupos().subscribe(result => {
      this.dataSource = new MatTableDataSource<DocGrupo>(result.data);
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

    if (this.transaccionIsNew) {
      this.grupoService.setGrupo().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    } else {
      this.grupoService.updateGrupo().subscribe(result => {

        if (result.status === 1) {
          this.CargarDgvElements();
        } else {
          this.errorService.handleError(result.error);
        }
        this.Limpiar();
      }, (error) => {
        this.errorService.handleError(error);
      });
    }

  }

  eliminarClick() {
    this.grupoService.deleteGrupo().subscribe(result => {

      if (result.status === 1) {
        this.CargarDgvElements();
      } else {
        this.errorService.handleError(result.error);
      }
      this.Limpiar();
    }, (error) => {
      this.errorService.handleError(error);
    });
  }


  setOperationsData() {
    this.transaccionIsNew = false;
    const grupo = this.dataSource.data[this.ROW_NUMBER];
    this.grupoService.form.patchValue({ IdGrupo: grupo.IdGrupo, Grupo: grupo.Grupo });
    this.dialogTittle = 'Modificar Grupo';
  }

  Limpiar() {
    this.grupoService.form.reset();
    this.grupoService.InicializarValoresFormGroup();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Grupo';
      $('#OperationModalDialog').modal('hide');
    }
  }

}
