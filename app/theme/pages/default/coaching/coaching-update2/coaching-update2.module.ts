import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CoachingUpdate2Component } from './coaching-update2.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": CoachingUpdate2Component
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
        ReactiveFormsModule,
        NgbModule.forRoot()
    ], exports: [
        RouterModule
    ], declarations: [
        CoachingUpdate2Component
    ]
})
export class CoachingUpdate2Module {



}