import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.css']
})
export class AdditionalInfoComponent implements OnInit {
  TabIndex = 0;
  IsRecursos: boolean;
  IsDetalles: boolean;
  VisorEdit: number;
  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.TabIndex = this.activeRoute.snapshot.params.tabindex;
    this.VisorEdit = this.activeRoute.snapshot.params.visoredit;

    console.log('this.TabIndex', this.TabIndex);

    if (!isNullOrUndefined(this.VisorEdit)) {
      if (this.TabIndex > 0) {
        this.IsRecursos = true;
        console.log('this.IsRecursos', this.IsRecursos);
      } else {
        this.IsDetalles = true;
        console.log('this.IsDetalles', this.IsDetalles);
      }
    }
  }

}
