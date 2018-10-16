import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Certification } from '../../../../../model/certification/certification';
import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';

import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { Assesment } from '../../../../../model/assesment/assesment'
import { message } from "../../../../../message/default";

declare let toastr: any;
declare var jQuery: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-register.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, AssesmentService]

})
export class CertRegisterComponent implements OnInit, AfterViewInit, OnDestroy {

    certification: Certification;

    loading: boolean = false;
    isEditable = false;

    id: string;
    user: any;
    private sub: any;
    userid: string;

    objUser = null;

    message: any = {
        success: "Permohonan latihan telah berjaya disimpan",
        error404: "Penilaian Kendiri tiada bagi Latihan ini, Sila hubungi Pentadbir sistem untuk maklumat lanjut",
        error409: "Anda telah membuat Penilaian untuk Latihan ini."
    }

    confirmType: string = "success";
    confirmMsg: string;
    action: string;

    constructor(private _script: ScriptLoaderService,
        private certificationService: CertificationService,
        private router: Router,
        private route: ActivatedRoute,
        private assesmentService: AssesmentService) { }


    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.certificationService.getCertification().subscribe(
            certification => {

                this.user = certification;

            },
        );

        this.certificationService.getUser(this.userid).subscribe(
            data => {
                this.objUser = data;
            }
        )
    }

    backPage() {
        this.router.navigate(['/cert/list/']);
    }

    redirectNewListPage(id: string) {

        if (id) {
            this.certificationService.getCertificationById(id).subscribe(
                data => {
                    this.certification = data;

                    let certificationUser: CertificationUser = new CertificationUser(
                        this.objUser,
                        this.certification,
                        null,
                        "1",
                        null,
                        null,
                        null,
                        null,
                        null,
                        null, null);

                    let assesArr: any[] = new Array();
                    let assesObj: Assesment = new Assesment(
                        null,
                        null,
                        null,
                        data.level,//level
                        null,
                        data.technology,//tech
                        null,
                        null,
                        null,
                        null,
                        this.objUser//user
                    )
                    assesArr.push(assesObj);

                    this.certificationService.isExistCertificationUser(certificationUser).subscribe(
                        success => {

                            this.assesmentService.generateQue(assesArr).subscribe(
                                success => {
                                    this.action = "NEW";
                                    this.confirmMsg = message.certificate.new;
                                    this.confirmType = "danger";
                                    jQuery('#m_modal_add').modal('show');
                                    localStorage.setItem("EXAMOBJ", JSON.stringify(success));
                                    localStorage.setItem("CERTOBJ", JSON.stringify(data));
                                    localStorage.setItem("ASSESMODE", "CERTIFICATE");
                                },
                                error => {
                                    var errorType = error;

                                    if (errorType == 404) {
                                        toastr.error(message.certificate.error404);
                                    } else if (errorType == 409) {
                                        this.confirmMsg = message.certificate.error409;
                                        this.confirmType = "success";
                                        this.action = "EXIST";
                                        jQuery('#m_modal_add').modal('show');

                                    }
                                }
                            );
                        },
                        error => {
                            console.log(error)
                            toastr.error(message.cap.danger);
                        }
                    );
                }
            );
        }
    }

    redirectNewDetailsPage(id: string) {
        this.router.navigate(['cert/details/', id]);
    }


    ngAfterViewInit() {

    }

    ngOnDestroy(): void {
    }


    onSubmit() {

    }

    onConfirm($event) {
        $event.preventDefault();

        if (this.action === "NEW") {

            jQuery('#m_modal_add').modal('hide');
            this.router.navigate(['assesment/user']);
        } else if (this.action === "EXIST") {

            let certificationUser: CertificationUser = new CertificationUser(
                this.objUser,
                this.certification,
                null,
                "1",
                null,
                this.objUser,
                null,
                null,
                null,
                null, null);

            this.certificationService.createCertificationUser(certificationUser).subscribe(
                success => {
                    this.isEditable = true;
                    this.loading = false;
                    jQuery('#m_modal_add').modal('hide');
                    toastr.success(message.certificate.success);
                    this.router.navigate(['cert/list/']);
                }
            );
        }
    }
}
