import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service';

declare let toastr: any;
declare var jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-view.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService]
})
export class CapViewComponent implements OnInit, AfterViewInit {

    capability: Capability;
    id: string;
    bearToken: string;
    capObj = null;
    start: string;
    end: string;
    aktivitiLs: any[];
    coachLs: any[];
    currentCoach: any;

    capForm: FormGroup;
    private activities = [];
    private aktiviti = [];
    private sub: any;

    constructor(private _script: ScriptLoaderService,
        private capabilityService: CapabilityService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        //capability id get
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
            }
        );

        this.capabilityService.getCapabilityById(this.id).subscribe(
            data => {
                this.capObj = data;
                this.start = this.formatDate(this.capObj.starting_date),
                    this.end = this.formatDate(this.capObj.ending_date),
                    this.capForm.patchValue({
                        name: this.capObj.name,
                        kepakaran: this.capObj.kepakaran.name,
                        duration: this.capObj.duration,
                        start_date: this.start,
                        end_date: this.end,
                        remarks: this.capObj.remarks
                    })
            }
        )

        this.capForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            kepakaran: new FormControl({ value: '', disabled: true }, Validators.required),
            coach: new FormControl({ value: '', disabled: true }, Validators.required),
            duration: new FormControl({ value: '', disabled: true }, Validators.required),
            start_date: new FormControl({ value: '', disabled: true }, Validators.required),
            end_date: new FormControl({ value: '', disabled: true }, Validators.required),
            remarks: new FormControl({ value: '', disabled: true }, Validators.required),
        })

        this.capabilityService.getCapabilityAct(this.id).subscribe(
            data => {

                this.aktiviti = data;
                for (var i = 0; i < this.aktiviti.length; ++i) {

                    //format Start_Date
                    var datestart = new Date();
                    var startdate = this.formatDate(this.aktiviti[i].start_date);

                    //format End_Date
                    var dateend = new Date();
                    var enddate = this.formatDate(this.aktiviti[i].end_date);

                    this.activities.push({
                        name: this.aktiviti[i].name,
                        venue: this.aktiviti[i].venue,
                        start: startdate,
                        endo: enddate,
                        attendance: this.aktiviti[i].attendance,
                        duration: this.aktiviti[i].duration

                    })
                }
            }
        )

        this.capabilityService.getCapabilityCoach(this.id).subscribe(
            data => {
                this.currentCoach = data;

            }
        )
    }

    onSubmit() {

    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/header/actions.js');

    }
    redirecListPage() {
        window.history.back();
    }

}
