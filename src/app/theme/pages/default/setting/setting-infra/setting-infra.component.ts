import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Infrastructure } from '../../../../../model/infrastructure/infrastructure';
import { InfrastructureService } from '../../../../../services/infrastructure/infrastructure.service';
import { UserService } from '../../../../../services/user.service';

declare var $: any;
declare let toastr:any;
declare var moment: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./setting-infra.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [InfrastructureService, UserService]
})
export class SettingInfraComponent implements OnInit, AfterViewInit, OnDestroy {

	id: string;
    userid: string;
    userObj: any;

	technology: any;
	infraForm: FormGroup;

    loading: boolean = false;
    isEditable = false;
    message: any = {
      success: "Permohonan Telah Berjaya Diterima",
      danger: "Permohonan Telah Berjaya Ditolak"
    }

	private sub: any;

    constructor(private _script: ScriptLoaderService, private infrastructureService:InfrastructureService, private userService:UserService, private router:Router, private route: ActivatedRoute) { }
    
    ngOnInit() {

    	//as infrastructure id
    	this.sub = this.route.params.subscribe(
    		params => {
      			this.id = params['id'];
      		}
      	);

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;



    	//initiate infrastructure Form
    	this.infraForm = new FormGroup(
	    	{
	    		pemohon: new FormControl({value: '', disabled: true}),
                type: new FormControl({value: '', disabled: true}),
	    		agency: new FormControl({value: '', disabled: true}),
	    		remarks: new FormControl({value: '', disabled: true}),
	    		os: new FormControl({value: '', disabled: true}),
                vcpu: new FormControl({value: '', disabled: true}),
	    		memori: new FormControl({value: '', disabled: true}),
	    		rootDisk: new FormControl({value: '', disabled: true}),
	    		ephemeralDisk: new FormControl({value: '', disabled: true}),
	    		swapDisk: new FormControl({value: '', disabled: true}),
                persistentDisk: new FormControl({value: '', disabled: true}),
	    		webServer: new FormControl({value: '', disabled: true}),
                framework: new FormControl({value: '', disabled: true}),
                database: new FormControl({value: '', disabled: true}),
                language: new FormControl({value: '', disabled: true}),
                adminRemarks: new FormControl('',Validators.required),
	    	}
	    )

	    //patchvalue infrastructure Form
	    if(this.id){
	    	this.infrastructureService.getInfrastructureById(this.id).subscribe(
	    		data => { 
	    			this.id = data.id

                    this.userService.getUserById(this.userid).subscribe(
                        data=>{
                            this.userObj = data;
                        }
                    )

                    let agensi = "";

                      if(data.user.type=="GOV"){
                        if(data.user.agency!=null){
                          agensi = data.user.agency.name;
                        }else{
                          agensi = "";
                        }
                      }else if(data.user.type=="PRIVATE"){
                        if(data.user.company!=null){
                          agensi = data.user.company.name;
                        }else{
                          agensi = "";
                        }
                      }else{
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

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper');
    }

    redirectListPage() {
      this.router.navigate(['/infra-management/approval']);
    }

    accepted(){
    	if(this.id){
    		let infrastructure: Infrastructure = new Infrastructure(
    			null,
    			null,
                null,
    			'2',
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
                null,
                this.infraForm.controls['adminRemarks'].value,
                null,
                null,
                this.userObj,
                null,
    			this.id
    			)
    		this.infrastructureService.updateInfrastructure(infrastructure).subscribe(
    			success =>{
    				this.isEditable = true;
                    this.loading = false;
                    toastr.success(this.message.success);
                    this.redirectListPage();
    			}
    		);
    	}
    }

    rejected(){
    	if(this.id){
    		let infrastructure: Infrastructure = new Infrastructure(
    			null,
    			null,
                null,
    			'3',
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
    			null,
                null,
                this.infraForm.controls['adminRemarks'].value,
                null,
                null,
                this.userObj,
                null,
    			this.id
    			)
    		this.infrastructureService.updateInfrastructure(infrastructure).subscribe(
    			success =>{
                    this.isEditable = true;
                    this.loading = false;
                    toastr.success(this.message.danger);
                    this.redirectListPage();
    			}
    		);
    	}
    }
}