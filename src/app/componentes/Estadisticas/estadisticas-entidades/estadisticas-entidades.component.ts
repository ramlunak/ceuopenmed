import { EstadistiasUsuarios, EntidadesMenosAsociadas } from './../../../models/estadisticas';
import { Component, OnInit, ViewChild } from '@angular/core';
import { EntidadService } from 'src/app/services/entity/entidad.service';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Entidad } from 'src/app/models/entidad';
import { OrderPipe } from 'ngx-order-pipe';
import { AsociacionService } from 'src/app/services/entity/asociacion.service';


@Component({
  selector: 'app-estadisticas-entidades',
  templateUrl: './estadisticas-entidades.component.html',
  styleUrls: ['./estadisticas-entidades.component.css']
})
export class EstadisticasEntidadesComponent implements OnInit {


  // DataTable --
  dataSource: MatTableDataSource<EntidadesMenosAsociadas>;
  displayedColumns = ['IdEntidad', 'entidad', 'asociaciones'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  dataSourceAux: any;
  dataSourcePalabras: any;
  ROW_NUMBER: number;


  constructor(
    private Service: EntidadService,
    private authService: AuthService,
    private errorService: ErrorHandlerService,
    private asociacionService: AsociacionService,
    private router: Router) { }

  ngOnInit() {
    this.CargarDgvElements();
  }


  CargarDgvElements() {

    this.Service.getEntidadesMenosEvaluadas().subscribe(result => {

      this.dataSource = new MatTableDataSource<EntidadesMenosAsociadas>(result.data);
      this.dataSourceAux = new MatTableDataSource<EntidadesMenosAsociadas>(result.data);
      this.dataSourcePalabras = new MatTableDataSource<EntidadesMenosAsociadas>(result.data);
      this.applyPredicate();
      this.dataSource.paginator = this.paginator;

    }, (error) => {
      this.errorService.handleError(error);
    });

  }

  goToAsociciones() {

    const entidad = this.dataSource.filteredData[this.ROW_NUMBER];

    this.asociacionService.form.patchValue({
      IdEntidad1: entidad.IdEntidad,
      entidadSelecionada: entidad.entidad
    });
    this.redirectToAsociacion();
  }

  public redirectToAsociacion = () => {
    this.router.navigate(['Asociacion']);
  }


  applyFilter(filterValue: string) {

    const palabras = filterValue.split(' ');
    this.dataSource.data = this.dataSourceAux.data;
    this.dataSourcePalabras.data = this.dataSource.data;
    this.dataSource.filteredData = this.dataSource.data;

    palabras.forEach(element => {
      if (element !== '' && element !== ' ') {

        if (this.dataSource.filteredData.length > 0)
          this.dataSourcePalabras.data = this.dataSource.filteredData;

        this.dataSourcePalabras.filter = element.trim().toLowerCase();
        this.dataSource.data = this.dataSourcePalabras.filteredData;
      }
    });
  }


  applyPredicate() {
    this.dataSourcePalabras.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }


  }


}
