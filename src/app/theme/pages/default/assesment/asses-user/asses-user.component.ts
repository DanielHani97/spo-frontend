import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router } from '@angular/router';

import { Agency } from '../../../../../model/setup/agency';
import { Technology } from '../../../../../model/setup/technology';
import { AssesmentService } from '../../../../../services/assesment/assesment.service';

import { Assesment } from '../../../../../model/assesment/assesment';
import { AssesmentQuestion } from '../../../../../model/assesment/assesmentQuestion';
import { AssesmentCollection } from '../../../../../model/assesment/assesmentCollection';

import { User } from '../../../../../model/user';
import { UserAssesment } from '../../../../../model/assesment/userAssesment';
import { UserAssesmentQuestion } from '../../../../../model/assesment/userAssesmentQuestion';
import { UserAssesmentTrax } from '../../../../../model/assesment/userAssesmentTrax';

import { Training } from '../../../../../model/training/training';
import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service'

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingUser } from '../../../../../model/coaching/coachingUser';
import { CoachingService } from '../../../../../services/coaching/coaching.service';

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service'

import { Certification } from '../../../../../model/certification/certification';
import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';

import { environment } from "../../../../../../environments/environment";
import { message } from "../../../../../message/default";

declare let toastr: any;
declare let jQuery: any;
@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./asses-user.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService, TrainingService, CoachingService, CapabilityService, CertificationService]
})
export class AssesUserComponent implements OnInit, AfterViewInit {

    token: string;
    bearToken: string;

    userId: string;
    technology: Technology;
    level: string;

    asses: any;
    finalAsses: Assesment[] = new Array();
    queLs: AssesmentQuestion[];
    currentAsses: Assesment;

    isSubmit: boolean = false;
    loading: boolean = false;
    loadingMark: boolean = false;

    totalMarks: any;

    stars: any[];

    currentUser: User;

    training: Training;
    capability: Capability;
    certificate: Certification;

    btnName: string = "Teruskan Permohonan";
    confirmMsg: string;

    count: number;
    coachingid: string;

    mode: string;

    message: any = {
        success: "Permohonan latihan telah berjaya disimpan",
        error404: "Penilaian Kendiri tiada bagi Latihan ini, Sila hubungi Pentadbir sistem untuk maklumat lanjut",
        error409: "Anda telah membuat Penilaian Kendiri untuk Latihan ini. Adakah anda pasti untuk meneruskan permohonan latihan?",
        new: "Anda belum membuat Penilaian Kendiri untuk Latihan ini. Adakah anda ingin membuat Penilaian Kendiri terlebih dahulu? ",
        danger: "Permohonan Latihan ini telah wujud."
    }

    constructor(private elRef: ElementRef,
        private router: Router,
        private assesmentService: AssesmentService,
        private trainingService: TrainingService,
        private location: Location,
        private coachingService: CoachingService,
        private capabilityService: CapabilityService,
        private certificationService: CertificationService
    ) { }

    ngOnInit() {
        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));



        this.mode = localStorage.getItem("ASSESMODE");
        if (this.mode === "COACHING") {
            this.coachingid = localStorage.getItem("COACHINGID");

            this.coachingService.getCoachingById(this.coachingid).subscribe(
                success => {
                    //start to assign assesment for user

                    let assesArr: any[] = new Array();

                    let frontObj: Assesment = new Assesment(
                        null,
                        null,
                        null,
                        success.frontendlevel,//level
                        null,
                        success.frontend,//tech
                        null,
                        null,
                        null,
                        null,
                        this.currentUser//user
                    )
                    assesArr.push(frontObj);

                    let backObj: Assesment = new Assesment(
                        null,
                        null,
                        null,
                        success.backendlevel,//level
                        null,
                        success.backend,//tech
                        null,
                        null,
                        null,
                        null,
                        this.currentUser//user
                    )
                    assesArr.push(backObj);

                    let dbObj: Assesment = new Assesment(
                        null,
                        null,
                        null,
                        success.databaselevel,//level
                        null,
                        success.database,//tech
                        null,
                        null,
                        null,
                        null,
                        this.currentUser//user
                    )
                    assesArr.push(dbObj);

                    this.assesmentService.generateQue(assesArr).subscribe(
                        success => {
                            this.asses = success;
                            //console.log(this.asses)
                        },
                        error => {
                            var errorType = error;

                            if (errorType == 404) {
                                jQuery('#m_modal_add').modal('show');
                                this.confirmMsg = message.coaching.error404;
                            } else if (errorType == 409) {
                                this.confirmMsg = message.coaching.error409;
                                jQuery('#m_modal_add').modal('show');

                            }
                        }
                    );

                    //end of assign assesment to user

                }
            );
        } else {
            let jsonData = localStorage.getItem("EXAMOBJ");
            if (jsonData) {
                this.asses = JSON.parse(jsonData);
                //console.log(this.asses)
                this.asses[0].user = this.currentUser;
            }
        }
    }

    ngAfterViewInit() {
        //remove lcoalStorage
        localStorage.removeItem("EXAMOBJ")


    }

    getAnswerForm(assesId) {
        let result: any[] = new Array();
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // var techId = this.asses[0].technology.id
        // var level = this.asses[0].level;
        var $cbAnswer = $("#" + assesId + ".ansRadFn");
        $cbAnswer.each(function(i) {
            //cbArr.push($(this).is(":checked"););
            var isCheck = $(this).is(":checked");
            if (isCheck) {

                var answer = $(this).val().toString();
                var queId = $(this).attr('name').toString();
                var level = $(this).prev().val().toString();
                var techId = $(this).prev().attr("id").toString();

                let obj: UserAssesmentTrax = new UserAssesmentTrax(
                    null,//id: string,
                    null,//userAssesId: string,
                    queId,//questionId: string,
                    answer,//answerId: string,
                    null,//question: string,
                    null,//answer: string,
                    currentUser,//user: User,
                    null,//mark: number,
                    null,//userAssesment: UserAssesment,
                    level,//level: string,
                    currentUser.id,//userId: string,
                    techId,//technologyId: string
                )

                result.push(obj);
            }

        });

        return result;
    }

    submitAnswer(id) {
        this.loadingMark = true;

        for (let obj of this.asses) {
            var objId = obj.id;
            if (objId === id) {
                this.currentAsses = obj;
                this.currentAsses.user = this.currentUser;
            }
        }

        let obj: AssesmentCollection = new AssesmentCollection(
            this.currentAsses,
            this.getAnswerForm(id)
        )

        console.log(obj);

        this.assesmentService.saveAssesUser(obj).subscribe(
            success => {

                console.log(success)
                var totalMark = success.totalMark;
                var totalQue = success.total;
                var mark = success.mark;

                for (let obj of this.asses) {
                    var objId = obj.id;
                    if (objId === id) {
                        obj.details = totalMark;//temporary set mark into detail for view only
                        obj.modifiedby = "( " + mark + " / " + totalQue + " )";//temporary set mark into odifiedby for view only
                        obj.category = "COMPLETE";
                    }
                }
            },
            error => console.log(error),
            () => {
                this.loadingMark = false;
            }
        );
        // this.assesmentService.saveQue(this.getAnswerForm(id)).subscribe(
        //   success => {
        //     var markInt = success;
        //
        //     for(let obj of this.asses){
        //       var objId = obj.id;
        //       if(objId === id){
        //         obj.details = markInt.toString();
        //         this.currentAsses = obj;
        //         this.currentAsses.user = this.currentUser;
        //         obj.category = "COMPLETE";
        //       }
        //     }
        //   },
        //   error => console.log(error),
        //   () => {
        //     this.assesmentService.historyCreate(this.currentAsses).subscribe();
        //     this.loadingMark = false;
        //   }
        // );

    }

    submit() {
        this.loading = true;

        var count = 0;
        var flag = 0;

        for (let obj of this.asses) {
            var category = obj.category;
            if (category == "COMPLETE") {
                flag++;
            }
            count++;
        }

        if (count == flag) {

            //let mode = localStorage.getItem("ASSESMODE");

            if (this.mode === "TRAINING") {

                let jsonData = localStorage.getItem("TRAININGOBJ");
                if (jsonData) {
                    this.training = JSON.parse(jsonData);
                }

                let trainingTx: TrainingTx = new TrainingTx(
                    this.currentUser,
                    this.training,
                    null,
                    null,
                    null,
                    "1",
                    null,
                    null,
                    null,
                    null,
                    null);

                this.trainingService.createTrainingTx(trainingTx).subscribe(
                    success => {
                        this.loading = false;
                        toastr.success(this.message.success);

                        this.router.navigate(['training/list/']);
                    },
                    error => {
                        toastr.danger(this.message.danger);
                    }, () => {
                        localStorage.removeItem("TRAININGOBJ");
                    }
                );

            }
            // else if(this.mode === "COACHING"){
            //   this.assesmentService.updateStatusCoaching(this.coachingid).subscribe(
            //     success => {
            //       toastr.success(message.coaching.success);
            //       this.router.navigate(['coaching/list/']);
            //     },
            //     error => {
            //       if(error == 404){
            //         toastr.error(message.coaching.error404);
            //       }else if(error == 409){
            //         toastr.error(message.coaching.error409);
            //       }
            //       this.loading = false;
            //     }
            //   );
            // }
            else if (this.mode === "CERTIFICATE") {
                let jsonData = localStorage.getItem("CERTOBJ");
                if (jsonData) {
                    this.certificate = JSON.parse(jsonData);
                }

                let certificationUser: CertificationUser = new CertificationUser(
                    this.currentUser,
                    this.certificate,
                    null,
                    "1",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null, null);

                this.certificationService.createCertificationUser(certificationUser).subscribe(
                    success => {
                        this.loading = false;
                        toastr.success(message.certificate.success);
                        this.router.navigate(['cert/list/']);
                    },
                    error => {
                        toastr.danger(message.certificate.danger);
                    }, () => {
                        localStorage.removeItem("CERTOBJ");
                    }
                );

            } else if (this.mode === "CAP") {
                let jsonData = localStorage.getItem("CAPOBJ");
                if (jsonData) {
                    this.capability = JSON.parse(jsonData);
                }

                let capabilityUser: CapabilityUser = new CapabilityUser(
                    this.currentUser,
                    this.capability,
                    "1",
                    null,
                    null,
                    this.currentUser,
                    null,
                    null,
                    null);

                this.capabilityService.createUser(capabilityUser).subscribe(
                    success => {
                        this.loading = false;
                        toastr.success(message.cap.success);
                        this.router.navigate(['cap/list/']);
                    },
                    error => {
                        toastr.danger(message.cap.danger);
                    }, () => {
                        localStorage.removeItem("CAPOBJ");
                    }
                );
            }

            //clear all the local storage for asssesment user
            localStorage.removeItem("ASSESMODE");
        } else {
            toastr.error(message.coaching.error409);
            this.loading = false;
        }
        // else{
        //   this.assesmentService.saveQue(this.getAnswerForm("")).subscribe(
        //     success => {
        //
        //       this.loading = false;
        //       this.isSubmit = true;
        //       this.btnName = "Teruskan Permohonan"
        //
        //       //save question history
        //       this.assesmentService.historyCreate(this.asses[0]).subscribe();
        //
        //       var markInt = Number(success);
        //       var count = 0;
        //       var star;
        //
        //       let result: any[] = new Array();
        //
        //       if(markInt > 0 && markInt <= 20){
        //         result.push("null")
        //       }else if(markInt > 20 && markInt <= 40){
        //         result.push("null")
        //         result.push("null")
        //       }else if(markInt > 40 && markInt <= 60){
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //       }else if(markInt > 60 && markInt <= 80){
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //       }else{
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //         result.push("null")
        //       }
        //       //
        //       // for(var i=0; i< count;i++){
        //       //   star += '<span class="fa fa-star star-checked w3-large"></span>';
        //       // }
        //       $("#questionList").hide();
        //       this.stars = result;
        //       this.totalMarks = markInt;
        //     }
        //   );
        // }
    }

    sitExam() {
        this.router.navigate(['assesment/exam']);
    }

    back() {
        if (this.mode == "COACHING") {
            this.router.navigate(['coaching/list']).then(() => { window.location.reload(); });
        } else if (this.mode == "TRAINING") {
            this.router.navigate(['training/list/']);
        } else if (this.mode == "CAP") {
            this.router.navigate(['cap/list/']);
        } else if (this.mode == "CERTIFICATE") {
            this.router.navigate(['cert/list/']);
        }
    }
}
