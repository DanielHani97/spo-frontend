import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityService } from '../../../../../services/capability/capability.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-report.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService]
})
export class CapReportComponent implements OnInit, AfterViewInit, OnDestroy {

    id: string;
    currentUser: any;
    bearToken: string;

    capName: string;
    kepakaran: string;
    startDate: string;
    endDate: string;
    coachList: string;
    tableHeader: any[];

    private sub: any;

    constructor(
        private _script: ScriptLoaderService,
        private capabilityService: CapabilityService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser = currentUser;

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                this.capabilityService.getCapabilityById(this.id).subscribe(
                    data => {
                        this.capName = data.name;
                        this.startDate = this.formatDate(data.starting_date);
                        this.endDate = this.formatDate(data.ending_date);
                        this.kepakaran = data.kepakaran.name;
                    }
                )

                this.capabilityService.getCapabilityCoach(this.id).subscribe(
                    data => {
                        var onlyCoach = data;

                        var str = "";
                        for (var i = 0; i < onlyCoach.length; ++i) {
                            str = str + onlyCoach[i].coach.name + ", "
                        }
                        str = str.substring(0, str.length - 2);
                        this.coachList = str;
                    }
                )

                this.capabilityService.getCapabilityReport(this.id).subscribe(
                    data => {
                        this.tableHeader = data;
                    }
                )
            }
        );
    }



    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }


    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper');
    }

    redirectListPage() {
        window.history.back();
    }

    onSubmit() {

    }

    redirectProfile(id) {
        this.router.navigate(['/header/profile/view/', id]);
    }
}
