import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CoachingRegisterComponent } from './coaching-register.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": CoachingRegisterComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        LayoutModule,
        FormsModule,
        ReactiveFormsModule
    ], exports: [
        RouterModule
    ], declarations: [
        CoachingRegisterComponent
    ]
})

export class CoachingRegisterModule {

}