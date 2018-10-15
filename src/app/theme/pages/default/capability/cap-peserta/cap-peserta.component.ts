import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityService } from '../../../../../services/capability/capability.service'
declare var $: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-peserta.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService]
})
export class CapabilityPesertaComponent implements OnInit, AfterViewInit, OnDestroy {


    id: string;
    
    users: any[];
    tempUsr:any;
    capForm: FormGroup;
    private sub: any;


    constructor(private _script: ScriptLoaderService, private capabilityService:CapabilityService, private router:Router, private route: ActivatedRoute) { }
    
    ngOnInit() {





        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.capabilityService.getCapabilityUser(this.id).subscribe(
                data => {
                    this.tempUsr = data;
                    this.users = this.tempUsr.filter(value=> value.status === '1')
                    if(this.users.length==0){
                        $("#m_modal_kosong").modal("show");
                    }
                }
            );
        });

        this.capForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
        
        })
    
    
    }

    close(){
        $("#m_modal_kosong").modal("hide");
        this.router.navigate(['/cap/list/coach']);
    }
    redirectValuation(id){
        this.router.navigate(['/cap/valuation/'+id]);
    }

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {
         // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
         //     'assets/osdec/validation/training/training-val.js');
    }

    onSubmit(){
    }
}