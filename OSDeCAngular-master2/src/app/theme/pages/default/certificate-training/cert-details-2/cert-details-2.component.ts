import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Certification } from '../../../../../model/certification/certification';
import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-details-2.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]

})
export class CertDetails2Component implements OnInit, AfterViewInit {

    certification: Certification;

    id: string;
    user: any;
    userid: string;

    title: string;
    endDate: string;
    startDate: string;
    level: string;
    remark: string;

    objUser = null;

    certForm: FormGroup;
    private sub: any;
    imageStr: string = "";

    constructor(private _script: ScriptLoaderService, private certificationService: CertificationService, private router: Router, private route: ActivatedRoute) { }


    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;

        this.certificationService.getUser(this.userid).subscribe(
            data => {
                this.objUser = data;
            }
        )


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.certificationService.getCertificationById(this.id).subscribe(
                data => {

                    this.title = data.title,
                        this.endDate = this.formatDate(data.endDate),
                        this.startDate = this.formatDate(data.startDate),
                        this.level = data.level,
                        this.remark = data.remark

                    this.imageStr = "data:image/JPEG;base64," + data.image;

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
        this.router.navigate(['/cert/list']);
    }

    onSubmit() {

    }
}