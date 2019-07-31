import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/seguridad/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})

export class AppComponent implements OnInit {


  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}

