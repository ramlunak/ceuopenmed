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
import { SintomasComponent } from './component/sintoma/sintomas/sintomas.component';
import { FormSintomaComponent } from './component/form-sintoma/form-sintoma.component';
import { FormTratamientoComponent } from './component/form-tratamiento/form-tratamiento.component';
import { FormAnatomiaComponent } from './component/form-anatomia/form-anatomia.component';
import { SintomaService } from './services/sintoma.service';
import { ValidatorService } from './services/validator.service';

const routes:Routes = [
  { path: 'enfermedades', component: EnfermedadesComponent },  
  { path: 'sintomas', component: FormSintomaComponent },  
  { path: '', component: AppComponent }
 ];

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    EnfermedadesComponent,
    SintomaDetalleComponent,
    SintomasComponent,
    FormSintomaComponent,
    FormTratamientoComponent,
    FormAnatomiaComponent,
        
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,   
    RouterModule.forRoot(routes),
    angularMaterial,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ValidatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
