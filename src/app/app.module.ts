import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import {RouterModule,Routes} from '@angular/router';
import {angularMaterial} from './angular.material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { EnfermedadesComponent } from './component/enfermedades/enfermedades.component';
import { SintomaDetalleComponent } from './component/sintoma/sintoma-detalle/sintoma-detalle.component';

const routes:Routes = [
  { path: 'enfermedades', component: EnfermedadesComponent },  
  { path: '', component: AppComponent }
 ];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    EnfermedadesComponent,
    SintomaDetalleComponent,
    
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,   
    RouterModule.forRoot(routes),
    angularMaterial,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
