import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Capability } from '../../../../../model/capability/capability';
import { CapabilityUser } from '../../../../../model/capability/capabilityUser';
import { CapabilityService } from '../../../../../services/capability/capability.service'
import { UserService } from '../../../../../services/user.service';

import { Assesment } from '../../../../../model/assesment/assesment'
import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { message } from "../../../../../message/default";

declare let toastr:any;
declare var jQuery:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cap-register.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CapabilityService, UserService, AssesmentService]

})
export class CapabilityRegisterComponent implements OnInit, AfterViewInit, OnDestroy {

    capability: Capability;

    id: string;
    capab: Capability[];
    capab2: any;
    private sub: any;
    userid : string;

    loading: boolean = false;
    message: any = {
      success: "Permohonan latihan telah berjaya disimpan",
      danger: "Permohonan Latihan ini telah wujud."
    }

    objUser = null;
    objtra = null;

    confirmType : string = "success";
    confirmMsg : string;
    action : string;

    constructor(private _script: ScriptLoaderService,
      private userService:UserService,
      private capabilityService:CapabilityService,
      private router:Router,
      private route: ActivatedRoute,
      private assesmentService: AssesmentService) { }

    ngOnInit() {

             let currentUser = JSON.parse(localStorage.getItem('currentUser'));
             this.userid = currentUser.id;

            this.capabilityService.getCapability().subscribe(
                capability => {

                        this.capab2 = capability;
                        this.capab = this.capab2.filter(value=> value.status === '1');

                },
           );

            this.userService.getUserById(this.userid).subscribe(
                data => {
                    this.objUser = data;
                }

            )
    }

    ngOnDestroy(): void{
    }

    redirectNewListPage(id: string) {

        if (id) {

            this.capabilityService.getCapabilityById(id).subscribe(
                data => {
                    this.capability = data;

                    let assesArr: any[] = new Array();

                    let assesObj : Assesment =  new Assesment (
                      null,
                      null,
                      null,
                      "Mahir",
                      null,
                      data.kepakaran,//tech
                      null,
                      null,
                      null,
                      null,
                      this.objUser//user
                    )

                    assesArr.push(assesObj);

                    let capabilityUser: CapabilityUser = new CapabilityUser (
                    this.objUser,
                    this.capability,
                    "1",
                    null,
                    null,
                    this.objUser,
                    null,
                    null,
                    null);

                    this.capabilityService.isExistCapabilityUser(capabilityUser).subscribe(
                        success=>{

                          this.assesmentService.generateQue(assesArr).subscribe(
                            success => {
                              this.action = "NEW";
                              this.confirmMsg = message.cap.new;
                              this.confirmType = "danger";
                              jQuery('#m_modal_add').modal('show');
                              localStorage.setItem("EXAMOBJ",JSON.stringify(success));
                              localStorage.setItem("CAPOBJ",JSON.stringify(data));
                              localStorage.setItem("ASSESMODE","CAP");
                            },
                            error => {
                              var errorType = error;

                              if(errorType == 404){
                                toastr.error(message.cap.error404);
                              }else if(errorType == 409){
                                this.confirmMsg = message.cap.error409;
                                this.confirmType = "success";
                                this.action = "EXIST";
                                jQuery('#m_modal_add').modal('show');

                              }
                            }
                          );
                        },
                        error=>{
                            this.loading = false;
                            toastr.error(this.message.danger);
                        }
                    );


                }
            );
          }


    }

    redirectNewDetailsPage(id: string) {
    this.router.navigate(['cap/application/', id]);
    }


    ngAfterViewInit() {

    }
    redirecListPage(){
        this.router.navigate(['cap/list/']);
    }
    onSubmit(){

        }

    onConfirm($event){
      $event.preventDefault();

      if(this.action === "NEW"){

        jQuery('#m_modal_add').modal('hide');
        this.router.navigate(['assesment/user']);
      }else if(this.action === "EXIST"){

        let capabilityUser: CapabilityUser = new CapabilityUser (
        this.objUser,
        this.capability,
        "1",
        null,
        null,
        this.objUser,
        null,
        null,
        null);

        this.capabilityService.createUser(capabilityUser).subscribe(
          success=>{
              this.loading = false;
              toastr.success(message.cap.success);
              jQuery('#m_modal_add').modal('hide');
              this.router.navigate(['cap/list/']);
          }
        );
      }
    }

}
