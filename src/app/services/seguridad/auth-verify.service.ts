import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthVerifyService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate() {
    if (this.authService.getCurrentUser()) {
      // login TRUE
      this.authService.showMenus = true;
      return true;
    } else {
      this.router.navigate(['login']);
      this.authService.showMenus = false;
      return false;
    }
  }
}
