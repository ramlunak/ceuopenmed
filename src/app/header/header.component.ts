import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { DialogChangePasswordComponent } from '../componentes/Seguridad/dialog-change-password/dialog-change-password.component';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private errorService: ErrorHandlerService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) { }

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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      width: '450px',
      data: this.authService.currentUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(result.OK, 'OK', {
          duration: 8000,
        });
      }

    });
  }

}
