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
    templateUrl: "./training-laporan-kehadiran.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]

})
export class TrainingLaporanKehadiranComponent implements OnInit, AfterViewInit {

    training: Training;

    id: string;
    user: any;
    userid: string;

    title: string;
    place: string;
    endDate: string;
    startDate: string;
    level: string;
    peserta: any[];

    objUser = null;
    kehadiran: any[];

    trainingForm: FormGroup;
    private sub: any;

    constructor(private _script: ScriptLoaderService, private trainingService: TrainingService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.trainingService.getUser(this.userid).subscribe(
            data => {
                this.objUser = data;
            }
        )

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                //console.log("----------->"+this.id);

                this.trainingService.getCoachByTraining(this.id).subscribe(
                    data => {
                        this.user = data;
                    }
                )

                this.trainingService.getTrainingById(this.id).subscribe(
                    data => {

                        this.title = data.title,
                            this.place = data.place,
                            this.endDate = this.formatDate(data.endDate),
                            this.startDate = this.formatDate(data.startDate),
                            this.level = data.level
                    });

                this.trainingService.getTrainingLaporan(this.id).subscribe(
                    data => {
                        this.kehadiran = data;
                    }
                )
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


    onSubmit() { }

    backPage() {
        this.router.navigate(['/training/laporan/']);
    }

}
