import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/seguridad/auth.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private errorService: ErrorHandlerService, private router: Router) { }

  ngOnInit() {
  }

  Logout() {
    this.authService.logoutUser().subscribe(result => {
      this.router.navigateByUrl('login');
      this.authService.showMenus = false;
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

}
