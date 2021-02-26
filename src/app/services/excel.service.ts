import { Injectable } from '@angular/core';
import alasql from 'alasql';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {

    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  public exportAllExcelFile(
    fileName: string,
    tiposEntidad: any,
    tiposRelaciones: any,
    idiomas: any,
    relaciones: any,
    entidades: any,
    detalles: any,
    recursos: any,
    descripciones: any): void {
    var opts = [
      { sheetid: 'tipos_entidad', header: true },
      { sheetid: 'tipos_relaciones', header: true },
      { sheetid: 'idiomas', header: true },
      { sheetid: 'relaciones', header: true },
      { sheetid: 'entidades', header: true },
      { sheetid: 'detalles', header: true },
      { sheetid: 'recursos', header: false },
      { sheetid: 'descripciones', header: false }];
    var res = alasql('SELECT INTO XLSX("' + fileName + '.xlsx",?) FROM ?',
      [opts, [tiposEntidad, tiposRelaciones, idiomas, relaciones, entidades, detalles, recursos, descripciones]]);
  }
}
