import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { SegUsuario } from './models/Seguridad/seg-usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
