import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../model/user';
import { TrainingCoach } from '../../../../../model/training/trainingCoach';
import { UserService } from '../../../../../services/user.service';
import { TrainingTx } from '../../../../../model/training/trainingTx';
import { Training } from '../../../../../model/training/training';
import { Technology } from '../../../../../model/setup/technology';
import { TrainingService } from '../../../../../services/training/training.service';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { Manday } from '../../../../../model/setup/manday';
import { MandayTransaction } from '../../../../../model/setup/mandayTransaction';
import { MandayService } from '../../../../../services/setup/manday.service';

import { environment } from "../../../../../../environments/environment";

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter"
declare var $: any;
declare let toastr: any;
declare var jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./training-setting.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [TrainingService, UserService, TechnologyService, MandayService, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class TrainingSettingComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    maxDate: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    endMin: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    startMax: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    usedManday: number;
    training: Training;
    id: string;
    trainingTemp: Training;
    trainingCoach: User;
    trainingUserTemp: TrainingTx;
    loading: boolean = false;
    isEditable = false;
    mandayObj: any;
    message: any = {
        success: "Maklumat telah berjaya disimpan",
        update: "Maklumat telah berjaya dikemaskini",
    }

    databaseLs: any[];
    bearToken: string;

    manday: any;
    manday2: any;
    mandayUsed: any;
    mandayId: string;

    datatable: any;

    technology: Technology;
    user: User;

    technologies: any[];
    currentTechnology: any;

    trainingForm: FormGroup;
    private sub: any;
    private userArray = [];
    private currentUser = [];
    private tempUser = [];

    private JLs = [];
    private newLs = [];
    private JL = [];
    private oldLs = [];

    @ViewChild('fileInput') fileInput;
    imageSrc: string = '';
    imageLoaded: boolean = false;
    loaded: boolean = false;
    errAvatar: boolean = false;

    confirmType: string = "success";
    confirmMsg: string;

    constructor(private _script: ScriptLoaderService,
        private trainingService: TrainingService,
        private technologyService: TechnologyService,
        private userService: UserService,
        private mandayService: MandayService,
        private router: Router,
        private route: ActivatedRoute,
        private parserFormatter: NgbDateParserFormatter,
        config: NgbDatepickerConfig) {

        config.outsideDays = 'collapsed';
        config.firstDayOfWeek = 7;

        config.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() === 0 || d.getDay() === 6;
        };
    }

    onChange(value) {
        if (value == null) {
            this.endMin = this.endMin;
        } else {
            this.endMin = value;
        }
    }

    onChange2(value) {
        if (value == null) {
            this.startMax = this.startMax;
        } else {
            this.startMax = value;
        }
    }

    onFileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.trainingForm.get('avatar').setValue(file);
        }
    }

    clearFile() {
        this.trainingForm.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }

    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');

        // this.userService.getUsers().subscribe(
        //   data => {
        //       this.userLs = data;
        //   }
        // );


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.trainingForm = new FormGroup({
            title: new FormControl('', Validators.required),
            technology: new FormControl('0', Validators.required),
            //duration: new FormControl('', Validators.required),
            remark: new FormControl('', Validators.required),
            place: new FormControl('', Validators.required),
            level: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
            avatar: new FormControl(),
            limitation: new FormControl('0', Validators.required)
        });

        this.technologyService.getTechnology().subscribe(
            success => {
                this.technologies = success;
            }
        );

        this.mandayService.getManday().subscribe(
            data => {
                this.manday = data;
                this.manday2 = this.manday.filter(value => value.category === 'training');
                this.mandayObj = this.manday2[0];
            }

        );

        //Load agency by id to edit
        if (this.id) { //edit form
            this.isEditable = true;

            this.trainingService.getTrainingById(this.id).subscribe(
                training => {

                    var startDate = new Date(training.startDate);
                    var endDate = new Date(training.endDate);

                    var tech = training.technology;

                    if (tech) {
                        this.technology = tech;
                        this.setTechnology(tech.id);
                    }

                    this.imageSrc = "data:image/JPEG;base64," + training.image;
                    this.id = training.id;
                    this.trainingForm.patchValue({
                        title: training.title,
                        technology: tech.id,
                        user: training.user,
                        //duration: training.duration,
                        startDate: { year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate() },
                        endDate: { year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate() },
                        place: training.place,
                        level: training.level,
                        status: training.status,
                        remark: training.remark,
                        limitation: training.limitation,

                    });

                    this.trainingService.getCoachByTraining(this.id).subscribe(
                        coach => {

                            this.JL = coach;
                            for (var i = 0; i < this.JL.length; ++i) {

                                this.userArray.push({
                                    id: this.JL[i].coach.id,
                                    name: this.JL[i].coach.name,
                                    email: this.JL[i].coach.email
                                })

                                this.newLs.push({
                                    id: this.JL[i].coach.id,
                                    name: this.JL[i].coach.name,
                                    email: this.JL[i].coach.email
                                })

                                this.oldLs.push({
                                    id: this.JL[i].id,
                                    name: this.JL[i].coach.name,
                                    email: this.JL[i].coach.email
                                })

                            }

                        });
                }, error => {
                    console.log(error);
                }
            );
        }

    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/training/training-val.js', 'assets/osdec/validation/validation.js'
        );

    }


    openModal() {

        if (this.datatable == null) {
            var options = {
                data: {
                    type: "remote",
                    source: {
                        read: {

                            url: environment.hostname + "/api/usergetcoach",
                            headers: {
                                "Authorization": this.bearToken
                            }

                        }
                    },
                    pageSize: 10,
                    saveState: {
                        cookie: false,
                        webstorage: false
                    },
                    serverPaging: !0,
                    serverFiltering: !0,
                    serverSorting: !0
                },
                layout: {
                    theme: "default",
                    class: "",
                    scroll: !1,
                    height: 550,
                    footer: !1
                },
                sortable: !0,
                pagination: !0,
                columns: [{
                    field: "id",
                    title: "#",
                    sortable: !1,
                    width: 40,
                    template: function(row) {
                        return row.user.id;
                    },
                    textAlign: "center",
                    selector: {
                        class: "m-checkbox--solid m-checkbox--brand cbFn"
                    }
                }, {
                    field: "name",
                    title: "Nama",
                    filterable: !1,
                    sortable: "asc",
                    width: 150,
                    template: function(row) {
                        return row.user.name;
                    }
                }, {
                    field: "skill",
                    title: "Kepakaran",
                    width: 150,
                    sortable: false,
                    template: function(row) {

                        var result = "";
                        var skills = row.user.skill;

                        if (skills != null) {
                            for (let obj of skills) {
                                result += obj.technology.name + ","
                            }
                            result = result.slice(0, -1)
                        }

                        return result;
                    }
                }, {
                    field: "email",
                    title: "Email",
                    width: 150,
                    template: function(row) {
                        return row.user.email;
                    }
                }]
            }


            let datatable = (<any>$('#recordList')).mDatatable(options);
            this.datatable = datatable;
            datatable.reload();
            $("#m_form_search").on("keyup", function(e) {
                datatable.setDataSourceParam("search", $(this).val());
                datatable.load();
            })

            $(document).on('click', '#m_datatable_check_all', (e) => {
                e.preventDefault();

                let cbArr: any[] = new Array();

                var $cbAnswer = $(".m-datatable__body").find(".m-checkbox > input");
                $cbAnswer.each(function(i) {
                    var status = $(this).is(":checked");
                    if (status) {
                        var id = $(this).val();
                        cbArr.push(id);
                    }

                });

                for (var i = 0; i < cbArr.length; ++i) {
                    this.onCheckOn(cbArr[i])
                }

                datatable.reload();
                $("#m_modal_1").modal("hide");

            });

            $(".m_datatable").on("m-datatable--on-check", function(e, a) {
                var l = datatable.setSelectedRecords().getSelectedRecords().length;
                $("#m_datatable_selected_number").html(l), l > 0 && $("#m_datatable_group_action_form").slideDown()
            }).on("m-datatable--on-uncheck m-datatable--on-layout-updated", function(e, a) {
                var l = datatable.setSelectedRecords().getSelectedRecords().length;
                $("#m_datatable_selected_number").html(l), 0 === l && $("#m_datatable_group_action_form").slideUp()
            })

        } else {
            this.datatable.load();
        }
    }

    onCheckOn(id: string) {

        for (var i = 0; i < this.userArray.length; ++i) {
            if (this.userArray[i].id == id) {
                this.userArray.splice(i, 1)
                break;
            }
        }

        this.userService.getUserById(id).subscribe(
            data => {
                this.userArray.push({
                    id: data.id,
                    name: data.name,
                    email: data.email
                })
            }
        )
    }

    onCheckOff(index) {
        this.userArray.splice(index, 1);
    }

    setTechnology(id: any): void {
        this.currentTechnology = this.technologies.filter(value => value.id === id);
        this.technology = this.currentTechnology[0];
    }

    onSubmit() {

        var form = $('#trainingForm');

        form.validate({
            rules: {
                startDate: "required",
                endDate: "required"
            }
        });


        if (!form.valid()) {
            return false;
        } else {
            if (this.trainingForm.valid) {

                let currentUser = JSON.parse(localStorage.getItem('currentUser'));

                let ngbDate = this.trainingForm.controls['startDate'].value;
                let ngbDate2 = this.trainingForm.controls['endDate'].value;
                let startdate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
                let enddate = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);

                if (this.id) {
                    let training: Training = new Training(
                        this.trainingForm.controls['title'].value,
                        this.technology,
                        this.user,
                        //this.trainingForm.controls['duration'].value,
                        startdate,
                        enddate,
                        this.trainingForm.controls['place'].value,
                        this.trainingForm.controls['level'].value,
                        this.trainingForm.controls['status'].value,
                        this.trainingForm.controls['remark'].value,
                        this.id,
                        null,
                        null,
                        currentUser.id,
                        this.trainingForm.controls['limitation'].value
                    );

                    let input = new FormData();
                    input.append('avatar', this.trainingForm.get('avatar').value);
                    input.append('info', new Blob([JSON.stringify(training)],
                        {
                            type: "application/json"
                        }));

                    const formModel = input;

                    this.trainingService.updateTraining(formModel).subscribe(
                        data => {

                            this.trainingTemp = data;

                            for (var i = 0; i < this.userArray.length; ++i) {
                                this.userService.getUserById(this.userArray[i].id).subscribe(
                                    data => {
                                        this.trainingCoach = data;
                                        let trainingCoach: TrainingCoach = new TrainingCoach(
                                            this.trainingCoach,
                                            this.trainingTemp,
                                            null)

                                        this.trainingService.createCoach(trainingCoach).subscribe(
                                            success => {
                                            }
                                        );

                                        for (var j = 0; j < this.oldLs.length; ++j) {
                                            this.trainingService.deleteCoach(this.oldLs[j].id).subscribe();
                                        }
                                    }
                                )
                            }
                            this.redirectTrainingPage();
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.update);

                        });


                } else {
                    let training: Training = new Training(
                        this.trainingForm.controls['title'].value,
                        this.technology,
                        this.user,
                        // this.trainingForm.controls['duration'].value,
                        startdate,
                        enddate,
                        this.trainingForm.controls['place'].value,
                        this.trainingForm.controls['level'].value,
                        this.trainingForm.controls['status'].value,
                        this.trainingForm.controls['remark'].value,
                        null,
                        null,
                        currentUser.id,
                        null,
                        this.trainingForm.controls['limitation'].value
                    );

                    let input = new FormData();
                    input.append('avatar', this.trainingForm.get('avatar').value);
                    input.append('info', new Blob([JSON.stringify(training)],
                        {
                            type: "application/json"
                        }));

                    const formModel = input;

                    this.trainingService.createTraining(formModel).subscribe(
                        data => {

                            this.trainingTemp = data;

                            for (var i = 0; i < this.userArray.length; ++i) {
                                this.userService.getUserById(this.userArray[i].id).subscribe(
                                    data => {
                                        this.trainingCoach = data;
                                        let trainingCoach: TrainingCoach = new TrainingCoach(
                                            this.trainingCoach,
                                            this.trainingTemp,
                                            null)

                                        this.trainingService.createCoach(trainingCoach).subscribe(

                                            success => {

                                            }
                                        )
                                    }
                                )
                            }

                            let manday: MandayTransaction = new MandayTransaction(
                                'Latihan',
                                this.trainingTemp.id,
                                1,
                                null,
                                startdate
                            );

                            this.mandayService.createMandayTrans(manday).subscribe(

                                success => {

                                    this.usedManday = this.mandayObj.mandayUsed; //value lama
                                    this.usedManday = this.usedManday + 1;

                                    let manday2: Manday = new Manday(
                                        null,
                                        null,
                                        this.usedManday,
                                        null,
                                        this.mandayObj.id
                                    );

                                    this.mandayService.updateMandayUsed(manday2).subscribe(

                                        success => {

                                            this.redirectTrainingPage();
                                            // this.newManday = this.mandayObj.total - this.mandayObj.mandayUsed; //balance manday
                                            this.isEditable = true;
                                            this.loading = false;
                                            toastr.success(this.message.success);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            }
        }
    }

    redirectTrainingPage() {
        this.router.navigate(['/training/listing']);
    }

    handleInputChange(e) {

        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        this.loaded = false;

        this.trainingForm.get('avatar').setValue(file);

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }

    handleImageLoad() {
        this.imageLoaded = true;
    }

    _handleReaderLoaded(e) {
        var reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
    }
}

