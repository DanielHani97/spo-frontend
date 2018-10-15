import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Certification } from '../../../../../model/certification/certification';
import { CertificationService } from '../../../../../services/certification/certification.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./certLs-peserta.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})
export class CertLsPesertaComponent implements OnInit, AfterViewInit, OnDestroy {


    certification: Certification;
    id: string;
    
    user: any;
    peserta: any;

    certForm: FormGroup;
    private sub: any;


    constructor(private _script: ScriptLoaderService, private certificationService:CertificationService, private router:Router, private route: ActivatedRoute) { }
    
    ngOnInit() {





        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.certificationService.getUserByCertification(this.id).subscribe(
                data => {
                  this.user = data;
                  this.peserta= this.user.filter(value =>value.status==='1');
        }
      );
        });

        this.certForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
        
        })
    
    
    }

    redirectValuation(id){
        this.router.navigate(['/cert/valuation/'+id]);
    }

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {
    }

    onSubmit(){
    }
}