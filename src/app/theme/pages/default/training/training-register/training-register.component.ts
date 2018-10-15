import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Training } from '../../../../../model/training/training';
import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service'

import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { Assesment } from '../../../../../model/assesment/assesment'

declare let toastr:any;
declare var jQuery:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-register.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, AssesmentService]

})
export class TrainingRegisterComponent implements OnInit, AfterViewInit, OnDestroy {

    training: Training;
    user: any;
    latihan: any;
    private sub: any;
    loading: boolean = false;
    isEditable = false;

    userid : string;
    id: string;
    userId : string;
    objUser = null;
    userObj: any;

    action : string;

    message: any = {
      success: "Permohonan latihan telah berjaya disimpan",
      error404: "Penilaian Kendiri tiada bagi Latihan ini, Sila hubungi Pentadbir sistem untuk maklumat lanjut",
      error409: "Anda telah membuat Penilaian Kendiri untuk Latihan ini. Adakah anda pasti untuk meneruskan permohonan latihan?",
      new: "Anda belum membuat Penilaian Kendiri untuk Latihan ini. Adakah anda ingin membuat Penilaian Kendiri terlebih dahulu? ",
      danger: "Permohonan Latihan ini telah wujud."
    }

    confirmType : string = "success";

    confirmMsg : string;

    constructor(private _script: ScriptLoaderService,
      private trainingService:TrainingService,
      private router:Router,
      private route: ActivatedRoute,
      private assesmentService: AssesmentService,
) { }

    ngOnInit() {

             let currentUser = JSON.parse(localStorage.getItem('currentUser'));
             this.userid = currentUser.id;

            this.trainingService.getTraining().subscribe(
                training => {

                    this.user = training;
                },
           );

            this.trainingService.getUser(this.userid).subscribe(
                data => {
                    this.objUser = data;
                }

             )             
    }

    ngOnDestroy(): void{
    }

    backPage(){
      this.router.navigate(['/training/list/']);
    }

    redirectNewListPage(id: string) {

        if (id) {

            this.trainingService.getTrainingById(id).subscribe(
                data => {
                    this.training = data;

                    let assesArr: any[] = new Array();


                    let assesObj : Assesment =  new Assesment (
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

                    let trainingTx: TrainingTx = new TrainingTx (
                    this.objUser,
                    this.training,
                    null,
                    null,
                    null,
                    "1",
                    null,
                    null,
                    null,
                    null,
                    null
                    );

                    //check whether user already apply for this training
                    this.trainingService.isExistTrainingTx(trainingTx).subscribe(
                      success => {//not apply
                          this.loading = false;

                          this.assesmentService.generateQue(assesArr).subscribe(
                            success => {
                              this.action = "NEW";
                              this.confirmMsg = this.message.new;
                              this.confirmType = "danger";
                              jQuery('#m_modal_add').modal('show');
                              localStorage.setItem("EXAMOBJ",JSON.stringify(success));
                              localStorage.setItem("TRAININGOBJ",JSON.stringify(data));
                              localStorage.setItem("ASSESMODE","TRAINING");
                            },
                            error => {
                              var errorType = error;

                              if(errorType == 404){
                                toastr.error(this.message.error404);
                              }else if(errorType == 409){
                                this.confirmMsg = this.message.error409;
                                this.confirmType = "success";
                                this.action = "EXIST";
                                jQuery('#m_modal_add').modal('show');

                              }
                            }
                          );
                      },
                      error => {//already apply
                        toastr.error(this.message.danger);
                      }
                    );
                }
            );
          }
    }

    redirectNewDetailsPage(id: string) {
    this.router.navigate(['training/details/', id]);
    }


    ngAfterViewInit() {

    }

    onConfirm($event){
      $event.preventDefault();

      if(this.action === "NEW"){

        jQuery('#m_modal_add').modal('hide');
        this.router.navigate(['assesment/user']);
      }else if(this.action === "EXIST"){

        let trainingTx: TrainingTx = new TrainingTx (
        this.objUser,
        this.training,
        null,
        null,
        null,
        "1",
        null,
        null,
        this.objUser,
        null,
        null
        );

        this.trainingService.createTrainingTx(trainingTx).subscribe(
          success => {
              this.router.navigate(['training/list/']);
              this.isEditable = true;
              this.loading = false;
              toastr.success(this.message.success);

              jQuery('#m_modal_add').modal('hide');
          }
        );
      }
    }

  }
