import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service'
import { TrainingTx } from '../../../../../model/training/trainingTx';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-details-2.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]

})
export class TrainingDetails2Component implements OnInit, AfterViewInit {

    training: Training;

    id: string;
    user: any;
    userid: string;

    title: string;
    endDate: string;
    startDate: string;
    level: string;
    remark: string;

    objUser = null;

    trainingForm: FormGroup;
    private sub: any;
    imageStr: string = "";

    constructor(private _script: ScriptLoaderService, private trainingService: TrainingService, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                this.trainingService.getCoachByTraining(this.id).subscribe(
                    data => {
                        this.user = data;
                    }

                )

            }
        );

        this.trainingService.getUser(this.userid).subscribe(
            data => {
                this.objUser = data;
            }
        )




        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.trainingService.getTrainingById(this.id).subscribe(
                data => {

                    this.title = data.title,
                        this.endDate = this.formatDate(data.endDate),
                        this.startDate = this.formatDate(data.startDate),
                        this.level = data.level,
                        this.remark = data.remark

                    this.imageStr = data.image;

                });
        },

            error => {
                console.log(error);
            }
        );
    }

    ngAfterViewInit() {

    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    redirectListPage() {
        this.router.navigate(['/training/list']);
    }

    onSubmit() {

    }
}
