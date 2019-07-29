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
    MatDividerModule,
    MatRadioModule,
    MatCheckboxModule
   
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
        MatDividerModule,
        MatRadioModule,
        MatCheckboxModule
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
        MatDividerModule,
        MatRadioModule,
        MatCheckboxModule
    ]
})

export class angularMaterial{}