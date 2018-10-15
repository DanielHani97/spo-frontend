import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { TrainingTx } from '../../../../../model/training/trainingTx';
import { TrainingService } from '../../../../../services/training/training.service';
import { Attendance } from '../../../../../model/attendance/attendance';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
import { UserService } from '../../../../../services/user.service'; 

declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-attendance-confirmation.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, AttendanceService, UserService]
})
export class TrainingAttendanceConfirmationComponent implements OnInit, AfterViewInit, OnDestroy {

    trainingTx: TrainingTx;
    attendance: Attendance;
    id: string;
    attendanceId: string;
    attendLs: any[];
    currentAttend: any;
    user: any;
    loading: boolean = false;
    isEditable = false;
    
    message: any = {
          success: "Kemaskini kehadiran telah berjaya disimpan"
        }
    userObj = null;
    objUser: any;
    userId: string;

    belowForm: FormGroup;
    trainingForm: FormGroup;
    private sub: any;


    constructor(private _script: ScriptLoaderService, private trainingService:TrainingService, private attendanceService:AttendanceService, private userService: UserService, private router:Router, private route: ActivatedRoute) { }

 
    ngOnInit() {
      this.trainingForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
            email: new FormControl({value: '', disabled: true}, Validators.required),
            title: new FormControl({value: '', disabled: true}, Validators.required),
            startDate: new FormControl({value: '', disabled: true}, Validators.required),
            place: new FormControl({value: '', disabled: true}, Validators.required),

       });

      this.belowForm = new FormGroup({
            status: new FormControl('', Validators.required),
            remarks: new FormControl()
        });

       this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.userService.getUserById(this.userId).subscribe( 
                        data=>{ 
                            this.objUser = data; 
                        } 
                    ) 

            this.trainingService.getTrainingTxById(this.id).subscribe(

                data => {

                  this.trainingForm.patchValue({
                      name: data.user.name,
                      email: data.user.email,
                      title: data.training.title,
                      startDate: this.formatDate(data.training.startDate),
                      place: data.training.place
                  })
                 
                  this.userObj = data.user;

                  this.attendanceService.getAttendance().subscribe(

                     data => {
                         this.attendLs = data;
                         this.currentAttend = this.attendLs.filter(value=> value.instanceId === this.id);
                         this.attendance = this.currentAttend[0];
                         this.attendanceId = this.attendance.id;
                     }
                  )
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
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/training/trainingAttend-val.js', 'assets/osdec/validation/validation.js');

    }

    redirectListPage() {
      this.router.navigate(['/training/list']);
    }
       
    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }

    yesCheck() {
        if (document.getElementById('yesCheck')) {
            document.getElementById('ifNo').style.visibility = 'hidden';
        }
        else document.getElementById('ifNo').style.visibility = 'hidden';
    }

    noCheck() {
        if (document.getElementById('noCheck')) {
            document.getElementById('ifNo').style.visibility = 'visible';
        }
        else document.getElementById('ifNo').style.visibility = 'hidden';
    }


    onSubmit() {

        if (this.belowForm.valid) { 

          if (this.attendance) {
               this.isEditable = true;

            let data: Attendance = new Attendance ( 
                  this.userObj, 
                  this.belowForm.controls['status'].value, 
                  this.belowForm.controls['remarks'].value, 
                  this.id, 
                  "Latihan",
                  null,
                  this.attendanceId); 

              this.attendanceService.updateAttendance(data).subscribe(
                success => { 
                    this.redirectListPage(); 
                    this.isEditable = true;
                    this.loading = false;
                    toastr.success(this.message.success);
                    } 
              );

              if (this.belowForm.controls['status'].value=="2") {
                this.isEditable = true;

                let data: TrainingTx = new TrainingTx (
                    null,
                    null,
                    null,
                    null,
                    null,
                    "5",
                    null,
                    this.id,
                    null,
                    null,
                    this.objUser,
                    );

                  this.trainingService.updateTrainingTx(data).subscribe(

                    success => { 
                    this.redirectListPage(); 
                    this.isEditable = true;
                    this.loading = false;
                    toastr.success(this.message.success);
                    } 
                  ); 
              }


          } else { 
                     this.isEditable = true;
          
                    let data: Attendance = new Attendance ( 
                        this.userObj, 
                        this.belowForm.controls['status'].value, 
                        this.belowForm.controls['remarks'].value, 
                        this.id,
                        "Latihan",
                        null, 
                        null); 

                    this.attendanceService.createAttendance(data).subscribe(
                      success => { 
                            this.redirectListPage();
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success); 
                         });

                    if (this.belowForm.controls['status'].value=="2") {
                      this.isEditable = true;

                    let data: TrainingTx = new TrainingTx (
                          null,
                          null,
                          null,
                          null,
                          null,
                          '5',
                          null,
                          this.id,
                          null,
                          null,
                          this.objUser,
                          );

                        this.trainingService.updateTrainingTx(data).subscribe(

                          success => { 
                            this.redirectListPage();
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.success); 
                         } 
                       );
                    }
                 }
        } 
    }}            