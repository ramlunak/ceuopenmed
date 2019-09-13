import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isString } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  errorMessage = '';

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) { }

  handleError = (error: HttpErrorResponse) => {
    if (error.status === 500) { // Error Interno del Servidor
      this.handle500Error(error);
    } else if (error.status === 401) { // No autorizado - De Momento se llama la página de logueo
      this.handle401Error(error);
    } else if (error.status === 404) { // Página no encontrada
      this.handle404Error(error);
    } else if (error.status === 400) { // Petición no valida Puede ser debido a un error de validacion de un campo
      this.handle400Error(error);
    } else {
      this.handleOtherError(error);
    }
  }

  private handle500Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.snackBar.open(this.errorMessage, 'OK', {
      duration: 8000,
    });
  }

  private handle401Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.authService.logoutUser().subscribe();
    this.router.navigateByUrl('/login');
    this.snackBar.open('Su sección a caducado, vuelva a iniciar sección.', 'OK', {
      duration: 8000,
    });
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.snackBar.open('Servicio desconocido en Servidor API Rest o Servidor API Rest desconectado.', 'OK', {
      duration: 8000,
    });
  }

  private handle400Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.snackBar.open(this.errorMessage, 'OK', {
      duration: 8000,
    });
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.snackBar.open(this.errorMessage, 'OK', {
      duration: 8000,
    });
  }

  private createErrorMessage(error: HttpErrorResponse) {
    if (isString(error.error)) {
      this.errorMessage = error.error ? error.error : error.statusText;
    } else {
      let str: string = error.error ? JSON.stringify(error.error.errors) : error.statusText;
      str = str.replace('{', '');
      str = str.replace('}', '');
      str = str.replace('[', ' ');
      str = str.replace(']', ' ');
      str = str.replace('\\', '');
      str = str.replace('\\', '');
      this.errorMessage = str;
    }
  }
}
