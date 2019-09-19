import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { AppConstantsService } from 'src/app/utils/app-constants.service';

@Injectable({
  providedIn: 'root'
})
export class AuthVerifyService implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private CONSTANS: AppConstantsService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.getCurrentUser()) {
      // login TRUE
      this.authService.showMenus = true;
      const url = state.url.split('/');
      return this.verifyPermissions(url[1]);
    } else {
      this.router.navigate(['login']);
      this.authService.showMenus = false;
      return false;
    }
  }

  private verifyPermissions(url: string): boolean {
    const roles = this.CONSTANS.getRoles();
    switch (url) {
      case '': case 'DialogChangePassword':
        return true;
      case 'segRol': case 'docEspecialidad': case 'docGrupo': case 'docEstudiante': case 'docProfesor':
      case 'docProfesorGrupos': case 'docProfesorEspecialidades': case 'tipoEntidad':
      case 'idioma': case 'TipoSociacion':
        return (this.authService.currentUser.IdRol === roles.Administrador);
      case 'entidad': case 'FormEntidad': case 'Asociacion': case 'EntidadRecurso':
        return (this.authService.currentUser.IdRol === roles.Profesor || this.authService.currentUser.IdRol === roles.Estudiante);
      default:
        return false;
    }
  }

}
