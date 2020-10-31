
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { IdiomaService } from '../../../services/administracion/idioma.service';
import { Idioma } from 'src/app/models/idioma';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

import { ExcelService } from '../../../services/excel.service';

import { Network, DataSet, Node, Edge } from 'vis-network/standalone';

// Selector jQuery
declare var $: any;

@Component({
  selector: 'app-idioma',
  templateUrl: './idioma.component.html',
  styleUrls: ['./idioma.component.css']
})

export class IdiomaComponent implements OnInit {

  transaccionIsNew = true;
  ROW_NUMBER: number;
  dialogTittle = 'Nuevo';

  // DataTable --
  dataSource: MatTableDataSource<Idioma>;
  displayedColumns = ['IdIdioma', 'Idioma', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Service: IdiomaService,
    private errorService: ErrorHandlerService,
    private excelService: ExcelService) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';
    this.CargarDgvElements();


    // create an array with nodes
    const nodesArray = new DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ]);

    // create an array with edges
    const edgesArray: Edge[] = [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
    ];

    const container = document.getElementById('mynetwork');
    const data = {
      nodes: nodesArray,
      edges: edgesArray,
    };
    const options = {};
    const network = new Network(container, data, options);

  }

  CargarDgvElements() {
    this.Service.get().subscribe(result => {
      this.dataSource = new MatTableDataSource<Idioma>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  guardarClick() {
    if (this.transaccionIsNew) {
      this.Service.set().subscribe(result => {

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
      this.Service.update().subscribe(result => {

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
    this.Service.delete().subscribe(result => {

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
    const idioma = this.dataSource.filteredData[this.ROW_NUMBER];
    this.Service.form.patchValue({ IdIdioma: idioma.IdIdioma, Idioma: idioma.Idioma });
    this.dialogTittle = 'Modificar';
  }

  Limpiar() {
    this.Service.InicializarValoresFormGroup();
    this.Service.form.reset();
    if (!this.transaccionIsNew) {
      this.transaccionIsNew = true;
      this.dialogTittle = 'Nuevo Idioma';
      $('#OperationModalDialog').modal('hide');
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ExportaExcel() {
    this.excelService.exportAsExcelFile(this.dataSource.data, 'myExcelFile');
  }

}
