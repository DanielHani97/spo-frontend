import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';
import { Attendance } from '../../../../../model/attendance/attendance';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-preattendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, AttendanceService]
})
export class CertPreattendanceComponent implements OnInit, AfterViewInit, OnDestroy {

    certificationUser: CertificationUser;
    attendance: Attendance;
    id: string;
    attendanceId: string;
    attendLs: any[];
    currentAttend: any;
    user: any;
    loading: boolean = false;
    isEditable = false;

    message: any = {
        success: "Kemaskini kehadiran telah berjaya disimpan"
    }

    userObj = null;

    belowForm: FormGroup;
    certForm: FormGroup;
    private sub: any;


    constructor(private _script: ScriptLoaderService, private certificationService: CertificationService, private attendanceService: AttendanceService, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {
        this.certForm = new FormGroup({
            name: new FormControl({ value: '', disabled: true }, Validators.required),
            email: new FormControl({ value: '', disabled: true }, Validators.required),
            title: new FormControl({ value: '', disabled: true }, Validators.required),
            startDate: new FormControl({ value: '', disabled: true }, Validators.required),
            place: new FormControl({ value: '', disabled: true }, Validators.required),

        });

        this.belowForm = new FormGroup({
            status: new FormControl('', Validators.required),
            remarks: new FormControl()
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.certificationService.getCertificationUserById(this.id).subscribe(

                data => {

                    this.certForm.patchValue({
                        name: data.user.name,
                        email: data.user.email,
                        title: data.certification.title,
                        startDate: this.formatDate(data.certification.startDate),
                        place: data.certification.place
                    })

                    this.userObj = data.user;

                    this.attendanceService.getAttendance().subscribe(

                        data => {
                            this.attendLs = data;
                            this.currentAttend = this.attendLs.filter(value => value.instanceId === this.id);
                            this.attendance = this.currentAttend[0];
                            this.attendanceId = this.attendance.id;
                        }
                    )
                },
                error => {
                    console.log(error);
                }
            );
        });

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();

    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/training/trainingAttend-val.js', 'assets/osdec/validation/validation.js');

    }

    redirectListPage() {
        this.router.navigate(['/cert/list']);
    }

    formatDate(date) {
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth() + 1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    yesCheck() {
        if (document.getElementById('yesCheck')) {
            document.getElementById('ifNo').style.visibility = 'hidden';
        }
        else document.getElementById('ifNo').style.visibility = 'hidden';
    }

    noCheck() {
        if (document.getElementById('noCheck')) {
            document.getElementById('ifNo').style.visibility = 'visible';
        }
        else document.getElementById('ifNo').style.visibility = 'hidden';
    }

    onSubmit() {

        if (this.belowForm.valid) {

            if (this.attendance) {
                this.isEditable = true;

                let data: Attendance = new Attendance(
                    this.userObj,
                    this.belowForm.controls['status'].value,
                    this.belowForm.controls['remarks'].value,
                    this.id,
                    "Persijilan",
                    null,
                    this.attendanceId);

                this.attendanceService.updateAttendance(data).subscribe(

                    success => {

                        if (this.belowForm.controls['status'].value == "2") {
                            this.isEditable = true;

                            let data: CertificationUser = new CertificationUser(
                                null,
                                null,
                                null,
                                "5",
                                this.id,
                                null,
                                null,
                                this.userObj,
                                null,
                                null,
                                null);

                            this.certificationService.updateCertificationUser(data).subscribe();
                        }
                        this.redirectListPage();
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                    }
                );
            } else {
                this.isEditable = true;

                let data: Attendance = new Attendance(
                    this.userObj,
                    this.belowForm.controls['status'].value,
                    this.belowForm.controls['remarks'].value,
                    this.id,
                    "Persijilan",
                    null,
                    null);

                this.attendanceService.createAttendance(data).subscribe(

                    success => {

                        if (this.belowForm.controls['status'].value == "2") {
                            this.isEditable = true;

                            let data: CertificationUser = new CertificationUser(
                                null,
                                null,
                                null,
                                "5",
                                this.id,
                                null,
                                null,
                                this.userObj,
                                null,
                                null,
                                null);

                            this.certificationService.updateCertificationUser(data).subscribe();
                        }

                        this.redirectListPage();
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                    }
                );
            }
        }
    }
}
