import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";


import { Manday } from '../../../../../model/setup/manday';
import { MandayService } from '../../../../../services/setup/manday.service';

declare let toastr: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./setting-manday.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [MandayService]
})
export class SettingMandayComponent implements OnInit {

    manday: Manday;

    id: string;
    trainId: string;
    capabId: string;
    coachId: string;
    certId: string;

    trainManUsed: number;
    capabManUsed: number;
    coachManUsed: number;
    certManUsed: number;

    trainManRev: string;
    capabManRev: string;
    coachManRev: string;
    certManRev: string;

    currentManday: any;
    category: any;
    categoryLs: any[];
    mandayLs: any[];
    mandays: any;

    ctTraining: any[];
    trainCategory: any;

    private mandayList = [];

    verified: any;

    private sub: any;

    mandayForm: FormGroup;

    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Maklumat Telah Berjaya Dikemaskini",
        update: "Maklumat Telah Berjaya Disimpan"
    }

    constructor(private _script: ScriptLoaderService, private mandayService: MandayService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {


        this.mandayForm = new FormGroup({

            // category: new FormControl(''),
            totalTrain: new FormControl(''),
            totalCapab: new FormControl(''),
            totalCoach: new FormControl(''),
            totalCert: new FormControl('')

        });


        this.mandayService.getManday().subscribe(
            manday => {

                for (let obj of manday) {
                    var id = obj.id;
                    var category = obj.category;
                    var total = obj.total;
                    var mandayUsed = obj.mandayUsed;
                    var mandayReserved = obj.mandayReserved;

                    this.verified = obj.total;
                    console.log(this.verified)

                    if (category == "training") {
                        this.trainId = id;
                        this.trainManUsed = mandayUsed;
                        this.trainManRev = mandayReserved
                        this.mandayForm.patchValue({
                            totalTrain: total
                        })
                    }

                    if (category == "capability") {
                        this.capabId = id
                        this.capabManUsed = mandayUsed;
                        this.capabManRev = mandayReserved
                        this.mandayForm.patchValue({
                            totalCapab: total
                        })
                    }

                    if (category == "coaching") {
                        this.coachId = id
                        this.coachManUsed = mandayUsed;
                        this.coachManRev = mandayReserved
                        this.mandayForm.patchValue({
                            totalCoach: total
                        })
                    }

                    if (category == "certificate") {
                        this.certId = id
                        this.certManUsed = mandayUsed;
                        this.certManRev = mandayReserved
                        this.mandayForm.patchValue({
                            totalCert: total
                        })
                    }
                }
            }
        );
    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
        );
    }

    onSubmit() {
        if (this.mandayForm.valid) {

            if (this.verified == null) {
                this.mandayList.push({
                    id: null,
                    category: "training",
                    total: this.mandayForm.controls['totalTrain'].value
                });
                this.mandayList.push({
                    id: null,
                    category: "capability",
                    total: this.mandayForm.controls['totalCapab'].value
                });
                this.mandayList.push({
                    id: null,
                    category: "coaching",
                    total: this.mandayForm.controls['totalCoach'].value
                });
                this.mandayList.push({
                    id: null,
                    category: "certificate",
                    total: this.mandayForm.controls['totalCert'].value
                });

                this.mandayService.createMandays(this.mandayList).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                        this.redirectMandayPage();
                    });


            }
            else {

                this.mandayList.push({
                    id: this.trainId,
                    category: "training",
                    total: Number(this.mandayForm.controls['totalTrain'].value),
                    mandayUsed: this.trainManUsed,
                    mandayReserved: this.trainManRev
                });
                this.mandayList.push({
                    id: this.capabId,
                    category: "capability",
                    total: Number(this.mandayForm.controls['totalCapab'].value),
                    mandayUsed: this.capabManUsed,
                    mandayReserved: this.capabManRev
                });
                this.mandayList.push({
                    id: this.coachId,
                    category: "coaching",
                    total: Number(this.mandayForm.controls['totalCoach'].value),
                    mandayUsed: this.coachManUsed,
                    mandayReserved: this.coachManRev
                });
                this.mandayList.push({
                    id: this.certId,
                    category: "certificate",
                    total: Number(this.mandayForm.controls['totalCert'].value),
                    mandayUsed: this.certManUsed,
                    mandayReserved: this.certManRev
                });
                console.log(this.mandayList)
                this.mandayService.updateManday(this.mandayList).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.update);
                        this.redirectMandayPage();
                    });
            }

        }

        //this.mandayForm.reset();
    }


    redirectMandayPage() {
        this.router.navigate(['/setting-manday/setting']);
    }
}
