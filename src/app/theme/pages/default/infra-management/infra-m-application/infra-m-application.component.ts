import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Infrastructure } from '../../../../../model/infrastructure/infrastructure';
import { Technology } from '../../../../../model/setup/technology';
import { InfrastructureService } from '../../../../../services/infrastructure/infrastructure.service';
import { UserService } from '../../../../../services/user.service';
import { TechnologyService } from '../../../../../services/setup/technology.service';

declare var $: any;
declare let toastr: any;
declare var moment: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./infra-m-application.html",
    encapsulation: ViewEncapsulation.None,
    providers: [InfrastructureService, UserService, TechnologyService]
})
export class InfraMApplicationComponent implements OnInit, AfterViewInit {

    id: string;
    bearToken: string;
    userid: string;
    agencyObj: any;
    userObj: any;
    frameworkLs: any[];
    backendLs: any[];
    databaseLs: any[];
    framework: Technology;
    database: Technology;
    currentFramework: any;
    currentBackend: any;
    currentDatabase: any;

    infraForm: FormGroup;
    private techLs = [];
    private sub: any;

    loading: boolean = false;
    isEditable = false;
    message: any = {
        success: "Permohonan Telah Berjaya Disimpan"
    }

    constructor(
        private _script: ScriptLoaderService,
        private infrastructureService: InfrastructureService,
        private userService: UserService,
        private technologyService: TechnologyService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;


        this.infrastructureService.getFrontend().subscribe(
            data => {
                this.frameworkLs = data;
            }
        );

        this.infrastructureService.getDatabase().subscribe(
            data => {
                this.databaseLs = data;
            }
        );

        this.infraForm = new FormGroup({
            pemohon: new FormControl({ value: '', disabled: true }, Validators.required),
            agency: new FormControl({ value: '', disabled: true }, Validators.required),
            type: new FormControl('', Validators.required),
            remarks: new FormControl('', Validators.required),
            os: new FormControl('', Validators.required),
            vcpu: new FormControl('', Validators.required),
            memori: new FormControl('', Validators.required),
            rootDisk: new FormControl('', Validators.required),
            ephemeralDisk: new FormControl('', Validators.required),
            swapDisk: new FormControl('', Validators.required),
            persistentDisk: new FormControl('', Validators.required),
            webServer: new FormControl('', Validators.required),
            framework: new FormControl('', Validators.required),
            database: new FormControl('', Validators.required),
            language: new FormControl('', Validators.required)
        })

        this.userService.getUserById(this.userid).subscribe(
            user => {
                this.userObj = user;
                let agensi = "";

                if (user.type == "GOV") {
                    if (user.agency != null) {
                        agensi = user.agency.name;
                    } else {
                        agensi = "";
                    }
                } else if (user.type == "PRIVATE") {
                    if (user.company != null) {
                        agensi = user.company.name;
                    } else {
                        agensi = "";
                    }
                } else {
                    agensi = "";
                }

                this.infraForm.patchValue({
                    agency: agensi,
                    pemohon: user.name

                })


            }
        )

        if (this.id) {
            this.infrastructureService.getInfrastructureById(this.id).subscribe(
                data => {
                    this.framework = data.framework;
                    this.database = data.database;
                    this.infraForm.patchValue({
                        type: data.type,
                        remarks: data.remarks,
                        os: data.os,
                        vcpu: data.vcpu,
                        memori: data.memori,
                        rootDisk: data.rootDisk,
                        ephemeralDisk: data.ephemeralDisk,
                        swapDisk: data.swapDisk,
                        persistentDisk: data.persistentDisk,
                        webServer: data.webServer,
                        framework: data.framework.id,
                        database: data.database.id,
                        language: data.language
                    })
                }
            )
        }
    }

    onSubmit() {

        if ($("#setuju").is(':checked')) {
            if (this.infraForm.valid) {

                if (this.id) {
                    let infrastructure: Infrastructure = new Infrastructure(

                        null,
                        this.infraForm.controls['type'].value,
                        null,
                        null,
                        this.infraForm.controls['remarks'].value,
                        this.infraForm.controls['os'].value,
                        this.infraForm.controls['vcpu'].value,
                        this.infraForm.controls['memori'].value,
                        this.infraForm.controls['rootDisk'].value,
                        this.infraForm.controls['ephemeralDisk'].value,
                        this.infraForm.controls['swapDisk'].value,
                        this.infraForm.controls['persistentDisk'].value,
                        this.infraForm.controls['webServer'].value,
                        this.framework,
                        this.database,
                        this.infraForm.controls['language'].value,
                        null,
                        null,
                        null,
                        null,
                        null,
                        this.id
                    )

                    this.infrastructureService.updateInfra(infrastructure).subscribe(
                        success => {
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success);
                            this.redirectPage();
                        }
                    );
                } else {
                    let infrastructure: Infrastructure = new Infrastructure(

                        this.userObj,
                        this.infraForm.controls['type'].value,
                        null,
                        '1',
                        this.infraForm.controls['remarks'].value,
                        this.infraForm.controls['os'].value,
                        this.infraForm.controls['vcpu'].value,
                        this.infraForm.controls['memori'].value,
                        this.infraForm.controls['rootDisk'].value,
                        this.infraForm.controls['ephemeralDisk'].value,
                        this.infraForm.controls['swapDisk'].value,
                        this.infraForm.controls['persistentDisk'].value,
                        this.infraForm.controls['webServer'].value,
                        this.framework,
                        this.database,
                        this.infraForm.controls['language'].value,
                        null,
                        this.userObj,
                        null,
                        null,
                        null,
                        null
                    )

                    this.infrastructureService.createInfrastructure(infrastructure).subscribe(
                        success => {
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success);
                            this.redirectPage();
                        }
                    );
                }
            }
        }
        else {
            $("#m_modal_setuju").modal("show");
        }
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/demo/default/custom/components/forms/widgets/bootstrap-select.js',
            'assets/osdec/validation/infra.js',
            'assets/osdec/validation/validation.js');

    }

    redirectPage() {
        this.router.navigate(['/infra/list']);
    }

    setFramework(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentFramework = this.frameworkLs.filter(value => value.id === id);
        this.framework = this.currentFramework[0];

    }

    setDatabase(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentDatabase = this.databaseLs.filter(value => value.id === id);
        this.database = this.currentDatabase[0];

    }

}