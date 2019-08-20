import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/seguridad/auth.service';

// Servicio de captura error implementado por mi
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private errorService: ErrorHandlerService, private router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this.authService.loginUser().subscribe(result => {

      if (result.status === 1) {
        this.authService.requestAccesToken(result.data.authorization_code).subscribe(result2 => {
          this.setUserInfo(result2.data.access_token);
        }, (error) => {
          this.errorService.handleError(error);
        });

      } else {
        this.errorService.handleError(result.error);
      }
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

  private setUserInfo(accesToken: string) {
    this.authService.getMyInformations(accesToken).subscribe(result => {
      this.authService.setUser(result.data);
      this.authService.setToken(accesToken);
      this.authService.form.reset();
      this.authService.InicializarValoresFormGroup();
      this.router.navigateByUrl('');
    }, (error) => {
      this.errorService.handleError(error);
    });
  }

}
