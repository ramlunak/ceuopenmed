import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DocProfesorService } from 'src/app/services/docencia/doc-profesor.service';
import { DocEspecialidad } from 'src/app/models/Docencia/doc-especialidad';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-doc-profesor-especialidades',
  templateUrl: './doc-profesor-especialidades.component.html',
  styleUrls: ['./doc-profesor-especialidades.component.css']
})
export class DocProfesorEspecialidadesComponent implements OnInit {

  ROW_NUMBER: number;
  dialogTittle = 'Nueva Especialidad';
  NombreProfesor: string;
  IdProfesor: number;

  // DataTable --
  dataSource: MatTableDataSource<DocEspecialidad>;
  displayedColumns = ['IdEspecialidad', 'Especialidad', 'commands'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // Selects
  listEspecialidades: DocEspecialidad[];

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
        this.profesorService.formEspecialidad.patchValue({ IdProfesor: this.IdProfesor });
      } else {
        this.errorService.handleError(result.error);
      }

    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarDgvElements() {
    this.profesorService.getEspecialidades(this.IdProfesor).subscribe(result => {
      this.dataSource = new MatTableDataSource<DocEspecialidad>(result.data);
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  CargarSelects() {
    this.profesorService.getUnsolicitedEspecialidades(this.IdProfesor).subscribe(result => {
      this.listEspecialidades = result.data;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  applyFilter(filterValue: string) {
    console.log(filterValue.trim().toLowerCase());
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarClick() {

    this.profesorService.setProfesorEspecialidad().subscribe(result => {

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
    this.profesorService.deleteProfesorEspecialidad().subscribe(result => {

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
    const profEspecialidad = this.dataSource.data[this.ROW_NUMBER];
    this.profesorService.formEspecialidad.patchValue({ IdProfesor: this.IdProfesor, IdEspecialidad: profEspecialidad.IdEspecialidad });
  }

  Limpiar() {
    this.profesorService.formEspecialidad.reset();
    this.profesorService.InicializarValoresFormEspecialidadGroup();
    this.profesorService.formEspecialidad.patchValue({ IdProfesor: this.IdProfesor });
    this.CargarSelects();
  }

  public redirectToProfesor = () => {
    this.router.navigateByUrl('docProfesor');
  }

}
