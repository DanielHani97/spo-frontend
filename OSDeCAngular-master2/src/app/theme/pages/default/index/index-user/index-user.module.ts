import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IndexUserComponent } from './index-user.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { ChartModule } from "primeng/primeng";


const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": IndexUserComponent,
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, ChartModule
    ], exports: [
        RouterModule
    ], declarations: [
        IndexUserComponent
    ]
})
export class IndexUserModule {



}
