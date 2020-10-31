import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/seguridad/auth.service';
import { enableProdMode } from '@angular/core';

enableProdMode();

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
