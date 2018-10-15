import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-approval-2.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService]

})
export class TrainingApproval2Component implements OnInit, AfterViewInit, OnDestroy  {

	  trainingTx: TrainingTx;
    id: string;
    userId: string;

    belowForm: FormGroup;
    trainingForm: FormGroup;
    private sub: any;

    userObj = null;
    trainingObj = null;
    trainingId: string;

    mark: any;

    constructor(private _script: ScriptLoaderService, private trainingService:TrainingService, private router:Router, private route: ActivatedRoute) { }


    ngOnInit() {

   this.trainingForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
            title: new FormControl({value: '', disabled: true}, Validators.required),
            agency: new FormControl({value: '', disabled: true}, Validators.required),
            technology: new FormControl({value: '', disabled: true}, Validators.required),
            startDate: new FormControl({value: '', disabled: true}, Validators.required),
            endDate: new FormControl({value: '', disabled: true}, Validators.required),
            level: new FormControl({value: '', disabled: true}, Validators.required),

       });

       this.belowForm = new FormGroup({
            qualification: new FormControl({value: '', disabled: true}, Validators.required),
            coach_remarks: new FormControl({value: '', disabled: true}, Validators.required),
            admin_remarks: new FormControl({value: '', disabled: true}, Validators.required)
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.trainingService.getTrainingTxById(this.id).subscribe(
                data => {

                  this.trainingId = data.training.id;

                  for(let obj of data.user.skill){
                    var objId = obj.technology.id;
                    if(objId === data.training.technology.id){
                      this.mark = obj.mark;
                    }
                  }

                  var agency = data.user.agency;
                  var agencyName = "";
                  if(agency){
                    agencyName = agency.name;
                  }

                  this.trainingForm.patchValue({
                  	name: data.user.name,
                    agency: agencyName,
                  	title: data.training.title,
                  	technology: data.training.technology.name,
                  	startDate: this.formatDate(data.training.startDate),
                    endDate: this.formatDate(data.training.endDate),
                  	level: data.training.level
                  })

	                this.userObj = data.user;
                  this.userId = data.user.id;
                  this.trainingObj = data.training;

                  this.belowForm.patchValue({
                        qualification: data.qualification,
                        coach_remarks: data.coach_remarks,
                        admin_remarks: data.admin_remarks
                  });
              },

            error => {
              console.log(error);
            }
          );
      });

    }

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {
    }

    redirectListPage() {
      this.router.navigate(['/training/list/admin/', this.trainingId]);
    }

    LihatProfilPage() {
      this.router.navigate(['/header/profile/view/', this.userId]);
    }

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    onSubmit(){

    }

   }
