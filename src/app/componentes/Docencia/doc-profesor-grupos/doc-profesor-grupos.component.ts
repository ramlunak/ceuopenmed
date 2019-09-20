import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from 'src/app/services/docencia/doc-profesor.service';
import { DocGrupo } from 'src/app/models/Docencia/doc-grupo';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-doc-profesor-grupos',
  templateUrl: './doc-profesor-grupos.component.html',
  styleUrls: ['./doc-profesor-grupos.component.css']
})
export class DocProfesorGruposComponent implements OnInit {

  ROW_NUMBER: number;
  dialogTittle = 'Nuevo Grupo';
  NombreProfesor: string;
  IdProfesor: number;

  // DataTable --
  dataSource: MatTableDataSource<DocGrupo>;
  displayedColumns = ['IdGrupo', 'Grupo', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listGrupos: DocGrupo[];

  constructor(
    private profesorService: DocProfesorService,
    private errorService: ErrorHandlerService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.paginator._intl.previousPageLabel = 'Anterior';
    this.paginator._intl.nextPageLabel = 'Siguiente';
    this.paginator._intl.firstPageLabel = 'Primero';
    this.paginator._intl.lastPageLabel = 'Último';

    this.IdProfesor = this.activeRoute.snapshot.params.id;
    this.profesorService.viewProfesor(this.IdProfesor).subscribe(result => {

      if (result.status === 1) {
        this.NombreProfesor = result.data.NombreCompleto;
        this.CargarDgvElements();
        this.CargarSelects();
        this.profesorService.formGrupos.patchValue({ IdProfesor: this.IdProfesor });
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarDgvElements() {
    this.profesorService.getGrupos(this.IdProfesor).subscribe(result => {
      this.dataSource = new MatTableDataSource<DocGrupo>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    this.profesorService.getUnsolicitedGroups(this.IdProfesor).subscribe(result => {
      this.listGrupos = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    this.profesorService.setProfesorGrupo().subscribe(result => {

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

  eliminarClick() {
    this.profesorService.deleteProfesorGrupo().subscribe(result => {

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
    const profGrupo = this.dataSource.data[this.ROW_NUMBER];
    this.profesorService.formGrupos.patchValue({ IdProfesor: this.IdProfesor, IdGrupo: profGrupo.IdGrupo });
  }

  Limpiar() {
    this.profesorService.formGrupos.reset();
    this.profesorService.InicializarValoresFormGruposGroup();
    this.profesorService.formGrupos.patchValue({ IdProfesor: this.IdProfesor });
    this.CargarSelects();
  }

  public redirectToProfesor = () => {
    this.router.navigateByUrl('docProfesor');
  }

}
