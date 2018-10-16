import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../../model/capability/capability';
import { CapabilityService } from '../../../../../../services/capability/capability.service'

import { FeedbackService } from '../../../../../../services/feedback/feedback.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./fb-capab.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, FeedbackService]
})
export class FBCapabComponent implements OnInit, AfterViewInit, OnDestroy {

    coaching: Capability;
    id: string;
    private sub: any;
    private activities = [];
    aktivitiLs: any[];
    role: string;
    currentUser: any;

    constructor(
        private _script: ScriptLoaderService,
        private capabilityService: CapabilityService,
        private router: Router,
        private route: ActivatedRoute,
        private feedbackService: FeedbackService) { }

    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));

        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];

                if (this.id) {
                    this.capabilityService.getCapabilityRole(this.id, this.currentUser.id).subscribe(
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

            this.capabilityService.getCapabActvFb(this.id).subscribe(
                data => {

                    for (let obj of data) {
                        let ngbDate = obj.start_date;
                        var dateA = new Date(ngbDate)

                        let ngbDate2 = obj.end_date;
                        var dateB = new Date(ngbDate2);

                        var activityId = obj.id;
                        var userId = this.currentUser.id;
                        var coachingId = this.id;
                        var isDone = false;

                        var name = obj.name;
                        var venue = obj.venue;
                        var duration = obj.duration;
                        var status = obj.done;

                        var txId = obj.keygen;

                        this.activities.push({
                            id: activityId,
                            name: name,
                            place: venue,
                            start: dateA,
                            endo: dateB,
                            duration: duration,
                            status: status,
                            participant: obj.userLs,
                            txid: txId
                        })

                        console.log(obj)
                    }

                }
            )
        }
    }

    redirectFbAction(activityId) {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/cap/feedback/action', this.currentUser.id, activityId]);
    }

    redirectROFb(txId) {
        console.log(txId)
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/cap/feedback/ro', this.currentUser.id, txId]);
    }

    redirectFbActionUser(activityId, userId) {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/cap/feedback/action', userId, activityId]);
    }

    redirectROFbUser(txId) {
        localStorage.setItem("PARENTID", this.id);
        this.router.navigate(['/cap/feedback/ro', this.currentUser.id, txId]);
    }


    redirectAttend() {
        if (this.role == "ROLE_USER") {
            this.router.navigate(['/cap/attendance', this.id]);
        } else if (this.role == "ROLE_COACH") {
            this.router.navigate(['/cap/coachAttendance', this.id]);
        }
    }

    redirectInfo() {
        this.router.navigate(['/cap/info', this.id]);
    }

    toggleChild(activityId) {
        $("#" + activityId).slideToggle();
    }
}
