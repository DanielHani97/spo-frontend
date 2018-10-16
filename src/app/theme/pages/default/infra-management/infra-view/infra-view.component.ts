import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Infrastructure } from '../../../../../model/infrastructure/infrastructure';
import { InfrastructureService } from '../../../../../services/infrastructure/infrastructure.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./infra-view.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [InfrastructureService]
})
export class InfraViewComponent implements OnInit, AfterViewInit, OnDestroy {

    id: string;
    technology: any;
    infraForm: FormGroup;

    private sub: any;

    constructor(private _script: ScriptLoaderService, private infrastructureService: InfrastructureService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {

        //as infrastructure id
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
            }
        );

        //initiate infrastructure Form
        this.infraForm = new FormGroup(
            {
                pemohon: new FormControl({ value: '', disabled: true }),
                type: new FormControl({ value: '', disabled: true }),
                agency: new FormControl({ value: '', disabled: true }),
                remarks: new FormControl({ value: '', disabled: true }),
                os: new FormControl({ value: '', disabled: true }),
                vcpu: new FormControl({ value: '', disabled: true }),
                memori: new FormControl({ value: '', disabled: true }),
                rootDisk: new FormControl({ value: '', disabled: true }),
                ephemeralDisk: new FormControl({ value: '', disabled: true }),
                swapDisk: new FormControl({ value: '', disabled: true }),
                persistentDisk: new FormControl({ value: '', disabled: true }),
                webServer: new FormControl({ value: '', disabled: true }),
                framework: new FormControl({ value: '', disabled: true }),
                database: new FormControl({ value: '', disabled: true }),
                language: new FormControl({ value: '', disabled: true })
            }
        )

        //patchvalue infrastructure Form
        if (this.id) {
            this.infrastructureService.getInfrastructureById(this.id).subscribe(
                data => {
                    this.id = data.id
                    let agensi = "";

                    if (data.user.type == "GOV") {
                        if (data.user.agency != null) {
                            agensi = data.user.agency.name;
                        } else {
                            agensi = "";
                        }
                    } else if (data.user.type == "PRIVATE") {
                        if (data.user.company != null) {
                            agensi = data.user.company.name;
                        } else {
                            agensi = "";
                        }
                    } else {
                        agensi = "";
                    }
                    this.infraForm.patchValue(
                        {
                            pemohon: data.user.name,
                            type: data.type,
                            agency: agensi,
                            remarks: data.remarks,
                            vcpu: data.vcpu,
                            os: data.os,
                            memori: data.memori,
                            rootDisk: data.rootDisk,
                            ephemeralDisk: data.ephemeralDisk,
                            swapDisk: data.swapDisk,
                            persistentDisk: data.persistentDisk,
                            webServer: data.webServer,
                            framework: data.framework.name,
                            database: data.database.name,
                            language: data.language
                        }
                    )
                },

                error => {
                    console.log(error);
                }
            )
        }

    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper');
    }

    redirectListPage() {
        window.history.back();
    }

}