import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../../model/coaching/coaching';
import { TrainingService } from '../../../../../../services/training/training.service'

import { FeedbackService } from '../../../../../../services/feedback/feedback.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./fb-training.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, FeedbackService]
})
export class FBTrainingComponent implements OnInit, AfterViewInit, OnDestroy {

    id: string;
    private sub: any;
    txLs: any[];
    role: string;
    currentUser: any;
    currentUserId: string;
    isExistPK: boolean = false;
    isExistPC: boolean = false;
    idPK: string;
    idPC: string;

    constructor(
        private _script: ScriptLoaderService,
        private trainingService: TrainingService,
        private router: Router,
        private route: ActivatedRoute,
        private feedbackService: FeedbackService) { }

    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.currentUserId = this.currentUser.id;

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                if (this.id) {
                    this.trainingService.getTrainingRole(this.id, this.currentUser.id).subscribe(
                        success => {
                            this.role = success;
                        }
                    )
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {

        if (this.id) {
            this.trainingService.getUserTraining(this.id).subscribe(
                success => {
                    if (this.role == "ROLE_COACH") {
                        this.txLs = success;
                    } else if (this.role == "ROLE_USER") {
                        for (let obj of success) {
                            var type = obj.status;
                            if (type == "PK") {
                                this.isExistPK = true;
                                this.idPK = obj.id;
                            } if (type == "PC") {
                                this.isExistPC = true;
                                this.idPC = obj.id;
                            }
                        }
                    }
                }
            );
        }
    }

    redirectPCFbAction() {
        localStorage.setItem("MODE", "PC");
        //localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/action', this.currentUser.id, this.id]);
    }

    redirectPKFbAction() {
        localStorage.setItem("MODE", "PK");
        //localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/action', this.currentUser.id, this.id]);
    }

    redirectFbAction(userid) {
        localStorage.setItem("MODE", "PKK");
        this.router.navigate(['/training/feedback/action', userid, this.id]);
    }

    redirectROFb(userid, traxId) {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/ro', userid, traxId]);
    }

    redirectROPCFb() {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/ro', this.currentUserId, this.idPC]);
    }

    redirectROPKFb() {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/ro', this.currentUserId, this.idPK]);
    }

    redirectFbActionUser(userId) {
        //localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/action', userId, this.id]);
    }

    redirectROFbUser(instanceid, userId) {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/training/feedback/ro', userId, instanceid]);
    }


    redirectAttend() {
        if (this.role === "ROLE_USER") {
            var trainingTxId = localStorage.getItem("TRAINING_TX_ID");
            this.router.navigate(['/training/current/attendance', trainingTxId]);
        } else if (this.role === "ROLE_COACH") {
            this.router.navigate(['/training/coachAttendance', this.id]);
        }
    }

    redirectInfo() {
        this.router.navigate(['/training/info', this.id]);
    }

    toggleChild(activityId) {
        $("#" + activityId).slideToggle();
    }
}
