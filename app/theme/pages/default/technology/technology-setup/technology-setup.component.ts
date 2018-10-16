import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';

declare let toastr: any;
@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./technology-setup.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TechnologyService]
})
export class TechnologySetupComponent implements OnInit, AfterViewInit, OnDestroy {

    technology: Technology;
    id: string;
    currentUser: any;
    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Maklumat Telah Berjaya Dikemaskini",
        baru: "Maklumat Telah Berjaya Disimpan"
    }

    technologyForm: FormGroup;
    private sub: any;

    constructor(private _script: ScriptLoaderService, private technologyService: TechnologyService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUser = currentUser.id;

        this.technologyForm = new FormGroup({
            name: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            //language: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required)
        });

        if (this.id) { //edit form
            this.technologyService.getTechnologyById(this.id).subscribe(
                technology => {
                    this.id = technology.id;
                    this.technologyForm.patchValue({
                        name: technology.name,
                        type: technology.type,
                        //language: technology.language,
                        status: technology.status

                    });
                }, error => {
                    console.log(error);
                }
            );
        }
    }



    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/setup/technology-val.js',
            'assets/osdec/validation/validation.js');

    }

    onSubmit() {
        if (this.technologyForm.valid) {
            if (this.id) {
                let technology: Technology = new Technology(
                    this.technologyForm.controls['name'].value,
                    this.technologyForm.controls['type'].value,
                    null,
                    this.technologyForm.controls['status'].value,
                    null,
                    this.currentUser,
                    this.id);

                this.technologyService.updateTechnology(technology).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                        this.redirectTechnologyPage();
                    }
                );
            } else {
                let technology: Technology = new Technology(
                    this.technologyForm.controls['name'].value,
                    this.technologyForm.controls['type'].value,
                    null,
                    this.technologyForm.controls['status'].value,
                    this.currentUser,
                    null,
                    null);

                this.technologyService.createTechnology(technology).subscribe(
                    success => {
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.baru);
                        this.redirectTechnologyPage();
                    }
                );
            }

        }
    }



    redirectTechnologyPage() {
        this.router.navigate(['/technology/list']);
    }
}
