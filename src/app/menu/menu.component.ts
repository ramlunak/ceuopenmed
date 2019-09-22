import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/seguridad/auth.service';
import { AppConstantsService } from '../utils/app-constants.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  isAdmin: boolean;
  isProf: boolean;

  constructor(private authService: AuthService, private CONSTANS: AppConstantsService) { }

  ngOnInit() {
    const roles = this.CONSTANS.getRoles();
    this.isAdmin = (this.authService.currentUser.IdRol === roles.Administrador);
    this.isProf = (this.authService.currentUser.IdRol === roles.Profesor);
  }

}
