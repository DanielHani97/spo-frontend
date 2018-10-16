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
    templateUrl: "./training-details-info.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]

})
export class TrainingDetailsInfoComponent implements OnInit, AfterViewInit {

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
    role: string;

    currentUser: any;

    constructor(private _script: ScriptLoaderService, private trainingService: TrainingService, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
            }
        );
    }

    ngAfterViewInit() {

        if (this.id) {

            this.trainingService.getCoachByTraining(this.id).subscribe(
                data => {
                    this.user = data;
                }
            )

            this.trainingService.getTrainingById(this.id).subscribe(
                data => {

                    this.title = data.title,
                        this.endDate = this.formatDate(data.endDate),
                        this.startDate = this.formatDate(data.startDate),
                        this.level = data.level,
                        this.remark = data.remark

                    this.imageStr = data.image;

                }
            );

            this.trainingService.getTrainingRole(this.id, this.currentUser.id).subscribe(
                success => {
                    this.role = success;
                }
            )
        }
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

    redirectAttend() {
        if (this.role === "ROLE_USER") {
            var trainingTxId = localStorage.getItem("TRAINING_TX_ID");
            this.router.navigate(['/training/current/attendance', trainingTxId]);
        } else if (this.role === "ROLE_COACH") {
            this.router.navigate(['/training/coachAttendance', this.id]);
        }
    }

    redirectFeedback() {
        this.router.navigate(['/training/feedback', this.id]);
    }

    onSubmit() {

    }
}
