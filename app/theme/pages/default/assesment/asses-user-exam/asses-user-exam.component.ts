import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Agency } from '../../../../../model/setup/agency';
import { AssesmentService } from '../../../../../services/assesment/assesment.service';

import { environment } from "../../../../../../environments/environment";

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./asses-user-exam.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService]
})
export class AssesUserExamComponent implements OnInit, AfterViewInit {

    token: string;
    bearToken: string;

    constructor(private elRef: ElementRef, private router: Router, private assesmentService: AssesmentService) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
    }

    ngAfterViewInit() {


    }

    sitExam() {
        this.router.navigate(['assesment/list/setup']);
    }
}
