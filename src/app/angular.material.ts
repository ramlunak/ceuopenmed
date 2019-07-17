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
    MatCardModule,
    MatGridListModule,
    MatDividerModule    
   
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
        MatTabsModule,
        MatCardModule,
        MatGridListModule,
        MatDividerModule
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
        MatTabsModule,
        MatCardModule,
        MatGridListModule,
        MatDividerModule
    ]
})

export class angularMaterial{}