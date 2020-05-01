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

    //dividir el filtro por spacio
    var palabras = filterValue.split(' ');

    this.dataSource.data = this.dataSourceAux.data;

    this.dataSourcePalabras.data = this.dataSource.data;
    this.dataSource.filteredData = this.dataSource.data;

    palabras.forEach(element => {

      if (element != "" && element != " ") {
        if (this.dataSource.filteredData.length > 0)
          this.dataSourcePalabras.data = this.dataSource.filteredData;

        this.dataSourcePalabras.filter = this.normalize(element.trim().toLowerCase());
        this.dataSource.data = this.dataSourcePalabras.filteredData;
      }

    });

  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();


}
