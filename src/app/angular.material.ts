import { NgModule } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

import {
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,   
    MatInputModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    
   
} from '@angular/material'

@NgModule({
    imports:[      
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,    
        MatInputModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTabsModule
    ],
    exports:[      
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,       
        MatInputModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTabsModule
    ]
})

export class angularMaterial{}