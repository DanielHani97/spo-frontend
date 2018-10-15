import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../../../environments/environment";
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '../../../../../model/user';
import { Attendance } from '../../../../../model/attendance/attendance';
import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service';
import { UserService } from '../../../../../services/user.service';
import { AttendanceService } from '../../../../../services/attendance/attendance.service';
import { KeygenService } from '../../../../../services/keygen.service';

declare let $:any;
declare let moment:any;
declare let toastr:any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-current-attendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [UserService, AttendanceService, TrainingService, KeygenService]

})
export class TrainingCurrentAttendanceComponent implements OnInit, AfterViewInit {

    kehadiran: boolean = false;
    id: string;
    userObj: any;
    fullCalendar : any;
    bearToken : string;
    private sub: any;
    userid: string;
    attForm: FormGroup;
    attendanceObj: any[];
    loading: boolean = false;
    isEditable = false;
    trainingId :  string;

    message: any = {
          success: "Kehadiran Telah Disimpan",
          danger: "Kehadiran Telah Wujud"
        }


    constructor(private _script: ScriptLoaderService, private userService:UserService, private trainingService:TrainingService, private attendanceService:AttendanceService, private keygenService:KeygenService, private router:Router, private route: ActivatedRoute) {

    }
    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userid = currentUser.id;
        localStorage.setItem('userIdAttendance', this.userid);

        this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
        this.sub = this.route.params.subscribe(
            params => {
                this.id = params['id'];
                localStorage.setItem('tokenId', this.id);
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.userid = currentUser.id;
                this.userService.getUserById(this.userid).subscribe(
                    data=>{
                        this.userObj = data;
                    }
                )
            }
        )

        this.attForm = new FormGroup({
            remarks: new FormControl('', Validators.required),
            attendance: new FormControl(),
            kodKehadiran: new FormControl(),
            startDate: new FormControl({value: '', disabled: true}, Validators.required),
            title: new FormControl({value: '', disabled: true}, Validators.required)

        })

    }

    backPage(){
      this.router.navigate(['/training/list/']);
    }

    ngAfterViewInit() {
        var CalendarBackgroundEvents = {
            init: function () {

                $("#m_calendar").fullCalendar({

                        buttonText: {
                            today:    'Hari Ini',
                            month:    'Bulan',
                            week:     'Minggu',
                            day:      'Hari',
                            list:     'Senarai'
                        },

                        weekends: false,

                        dayNamesShort: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                        dayNames: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],

                        header: {
                            left: "prev,next today",
                            center: "title",
                            right: "month,agendaWeek,agendaDay,listWeek"
                        },
                        editable: !0,
                        eventLimit: !0,
                        navLinks: !0,
                        businessHours: !0,
                        eventSources: [


                            {
                                url: environment.hostname+"/api/trainingTx/all/"+localStorage.getItem('tokenId')+"/"+localStorage.getItem('userIdAttendance'),
                                headers: {
                                    "Authorization": "Bearer "+localStorage.getItem('jwtToken')
                                },
                                type: 'POST'
                            }

                        ],

                        eventRender: function (event, element) {

                            if(moment(event.start).isoWeekday() == 7||moment(event.start).isoWeekday() == 6)
                            {
                                return false;
                            }

                            element.attr('href', 'javascript:void(0);');

                            element.click(function() {

                                if(event.isExist){

                                    $("#m_modal_hadir").modal("show");

                                }else{

                                $("#eventTitle").attr('placeholder', event.title);
                                $("#eventTitle").attr('value', event.id);
                                $("#eventPlace").attr('placeholder', event.description);
                                $("#eventDate").attr('placeholder', moment(event.start).format('DD/MMM/YYYY'));
                                $("#eventDate").attr('value', event.start);

                                $("#m_modal_1").modal("show");
                            }
                          });
                        }                        
                    })
            }
        };

        jQuery(document).ready(function () {
                CalendarBackgroundEvents.init()
            });

        this.trainingService.getTrainingTxById(this.id).subscribe(
          data =>{
            var trainingObj = data.training;
            if(trainingObj){
              this.trainingId = trainingObj.id;
            }
          }
        )

    }

    open(){
        this.kehadiran=true;
    }

    close(){
        this.kehadiran=false;
    }

    closeModal(){
        this.attForm.reset();

        this.kehadiran=false;
        $("#m_modal_1").modal("hide");
    }
   
    onSubmit(){

        var form = $('#attForm');
          form.validate({
           rules:{
             remarks: "required"
           }
        });

        if(!form.valid){
            return false;
        }else{

        if(this.attForm.valid){
            var dateEvent = $('#eventDate').attr('value');
            var idEvent = $('#eventTitle').attr('value');
            var idTitle = $('#eventTitle').attr('placeholder');

            if(this.kehadiran == true){
            this.keygenService.getKeygenByInstanceId(this.trainingId).subscribe(
                    data=>{
                       var keygen = data.keygen;
                       if(this.attForm.controls['kodKehadiran'].value===keygen){

                            let attendance: Attendance = new Attendance (
                                this.userObj,
                                this.attForm.controls['attendance'].value,
                                this.attForm.controls['remarks'].value,
                                idEvent,
                                "Latihan",
                                dateEvent,
                                null
                            )

                            this.attendanceService.createAttendance(attendance).subscribe(
                                success=>{
                                    this.isEditable = true;
                                    this.loading = false;
                                    toastr.success(this.message.success);
                                    this.attForm.reset();
                                    $("#m_modal_1").modal("hide");
                                    window.location.reload();

                                });
                       
                        }else{
                            this.attForm.reset();
                            this.kehadiran = false;
                            $("#m_modal_1").modal("hide");
                            $("#m_modal_code").modal("show");
                        }
                    },
                    errorCode=>{
                    this.attForm.reset();
                    this.kehadiran = false;
                    $("#m_modal_1").modal("hide");
                    $("#m_modal_code").modal("show");
                }
               )
            }else{

                let attendance: Attendance = new Attendance (
                    this.userObj,
                    this.attForm.controls['attendance'].value,
                    this.attForm.controls['remarks'].value,
                    idEvent,
                    "Latihan",
                    dateEvent,
                    null
                )
                
                this.attendanceService.createAttendance(attendance).subscribe(
                    success=>{
                        this.isEditable = true;
                        this.loading = false;
                        toastr.success(this.message.success);
                        this.attForm.reset();
                        $("#m_modal_1").modal("hide");
                        window.location.reload();

                    });
            
                }

             }
    
        }
    }
  

  redirectInfo(){
    localStorage.setItem("TRAINING_TX_ID", this.id);
    this.router.navigate(['/training/info', this.trainingId]);
  }

  redirectFeedback(){
    localStorage.setItem("TRAINING_TX_ID", this.id);
    this.router.navigate(['/training/feedback', this.trainingId]);
  }
}
