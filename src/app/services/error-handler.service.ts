import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/seguridad/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) { }

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
    // this.router.navigateByUrl('/500');
  }

  private handle401Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.authService.logoutUser().subscribe();
    this.router.navigateByUrl('/login');
  }

  private handle404Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    this.router.navigateByUrl('/404');
  }

  private handle400Error = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
  }

  private handleOtherError = (error: HttpErrorResponse) => {
    this.createErrorMessage(error);
    // TODO: this will be fixed later;
    // this.router.navigateByUrl('/500');
  }

  private createErrorMessage(error: HttpErrorResponse) {
    this.errorMessage = error.error ? error.error : error.statusText;
  }
}
