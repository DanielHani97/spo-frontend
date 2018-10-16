import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';
import { Agency } from '../../../../../model/setup/agency';
import { AgencyService } from '../../../../../services/setup/agency.service';
import { State } from '../../../../../model/ref/state';
import { City } from '../../../../../model/ref/city';
import { Grade } from '../../../../../model/setup/grade';
import { GradeService } from '../../../../../services/setup/grade.service';
import { Schema } from '../../../../../model/setup/schema';
import { SchemaService } from '../../../../../services/setup/schema.service';
import { Skill } from '../../../../../model/skill';
import { SkillService } from '../../../../../services/skill.service';
import { Certificate } from '../../../../../model/certificate';
import { CertificateService } from '../../../../../services/certificate.service';
import { Project } from '../../../../../model/project';
import { ProjectService } from '../../../../../services/project.service';
import { CountryService } from '../../../../../services/ref/country.service';
import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { FilestorageService } from '../../../../../services/ref/filestorage.service';

import { Company } from '../../../../../model/setup/company';

import { PasswordValidation } from '../../../../../../assets/osdec/validation/password-val';
import { AuthenticationService } from "../../../../../auth/_services/authentication.service";

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter"

import { message } from "../../../../../message/default";

declare var $: any;
declare let toastr: any;
declare let jQuery: any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./header-profile.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [
        UserService,
        ProjectService,
        CountryService,
        AgencyService,
        GradeService,
        SchemaService,
        SkillService,
        CertificateService,
        TechnologyService,
        AuthenticationService,
        FilestorageService,
        {
            provide: NgbDateParserFormatter,
            useClass: NgbDateFRParserFormatter
        }
    ]

})
export class HeaderProfileComponent implements OnInit, AfterViewInit {
    user: User;

    agency: Agency;
    agencyUser: Agency;
    agencyPrOs: Agency;

    agencyPrLn: Agency;

    agencyOs: any[];
    currentAgencyO: any;

    agencyLn: any[];
    currentAgencyL: any;

    agencyLs: any[];
    currentAgency: any;

    // project: Project;

    skill: Skill;
    certificate: Certificate;
    certificateLs: Certificate[];

    agencyForm: FormGroup;
    userAgencyForm: FormGroup;

    profileForm: FormGroup;
    settingForm: FormGroup;
    projectForm: FormGroup;
    projectxForm: FormGroup;
    technologyForm: FormGroup;

    id: string;
    agencyid: string;
    agencyGlobal: any;
    companyGlobal: any;
    userid: string;
    userObj: any;
    private sub: any;

    stateLs: any[];
    cities: any[];
    ccities: any[];

    currentState: any;
    currentCity: any;

    city: City;
    state: State;

    ccurrentState: any;
    ccurrentCity: any;

    ccity: City;
    cstate: State;

    grade: Grade;
    gradeLs: any[];
    currentGrade: any;

    schema: Schema;
    schemaLs: any[];
    currentSchema: any;

    technology: Technology;
    techLs: any[];
    currentTech: any;

    project: Project;
    projectLs: any[];
    private osdecPro = [];
    private osdecProject = [];
    private newLs = [];
    private oldLs = [];

    form: FormGroup;

    name: String;
    email: String;


    currentUser: any;

    picForm: FormGroup;

    certForm: FormGroup;

    @ViewChild('fileInput') fileInput;
    imageSrc: string = '';
    imageLoaded: boolean = false;
    loaded: boolean = false;

    technologyLs: any[];

    isShow: string = "hide";

    isSkillValid: boolean = false;
    loading: boolean = false;

    isGov: boolean = true;

    companyId: string;

    errorSkill: any = {
        type: "danger",
        text: "Sila Penuhkan Ruangan Dengan Betul"
    }

    message: any = {
        success: "Maklumat telah berjaya disimpan",
        invalidFormt: ""
    }

    //certificate file
    @ViewChild('fileCert') fileCert;
    fileName: String;
    fileCertId: string;

    constructor(
        fb: FormBuilder,
        private _script: ScriptLoaderService,
        private userService: UserService,
        private projectService: ProjectService,
        private agencyService: AgencyService,
        private countryService: CountryService,
        private gradeService: GradeService,
        private schemaService: SchemaService,
        private router: Router,
        private route: ActivatedRoute,
        private technologyService: TechnologyService,
        private skillService: SkillService,
        private filestorageService: FilestorageService,
        private certificateService: CertificateService,
        private parserFormatter: NgbDateParserFormatter,
        config: NgbDatepickerConfig
    ) {

        config.outsideDays = 'collapsed';
        config.firstDayOfWeek = 7;

        config.markDisabled = (date: NgbDateStruct) => {
            const d = new Date(date.year, date.month - 1, date.day);
            return d.getDay() === 0 || d.getDay() === 6;
        };

        // toastr.options = { positionClass: 'toast-top-right', }
    }
    ngOnInit() {

        //load
        this.agencyService.getAgency().subscribe(
            data => {
                this.agencyLs = data;
            });

        //load
        this.agencyService.getAgency().subscribe(
            data => {
                this.agencyOs = data;
            });

        //load technology project
        this.technologyService.getTechnology().subscribe(
            data => {
                this.techLs = data;
            }
        );

        // load grade value
        this.gradeService.getGrade().subscribe(
            data => {
                this.gradeLs = data;
            });

        this.schemaService.getSchema().subscribe(
            data => {
                this.schemaLs = data;
            });

        //load states value
        this.countryService.getState().subscribe(
            data => {
                this.stateLs = data;
            });

        //load technology
        this.technologyService.getTechnology().subscribe(
            success => {
                this.technologyLs = success;
            }
        );

        //load ProjectService
        this.projectService.getProject().subscribe(
            data => {
                this.projectLs = data;
                this.osdecPro = this.projectLs.filter(value => value.user.id === this.id);
                for (var i = 0; i < this.osdecPro.length; ++i) {

                    let ngbDate = this.osdecPro[i].starting_date;
                    var date = new Date(ngbDate)
                    let ngbDate2 = this.osdecPro[i].ending_date;
                    var date2 = new Date(ngbDate2)

                    this.osdecProject.push({

                        name: this.osdecPro[i].name,
                        technology: this.osdecPro[i].technology,
                        role: this.osdecPro[i].role,
                        description: this.osdecPro[i].description,
                        type: this.osdecPro[i].type,
                        starting_date: date,
                        ending_date: date2,
                        agency: this.osdecPro[i].agency,
                        user: this.userObj

                    });

                    this.newLs.push({
                        id: this.osdecPro[i].id,
                        name: this.osdecPro[i].name,
                        technology: this.osdecPro[i].technology,
                        role: this.osdecPro[i].role,
                        description: this.osdecPro[i].description,
                        type: this.osdecPro[i].type,
                        starting_date: date,
                        ending_date: date2,
                        agency: this.osdecPro[i].agency,
                        user: this.userObj
                    })

                    this.oldLs.push({
                        id: this.osdecPro[i].id,
                        name: this.osdecPro[i].name,
                        technology: this.osdecPro[i].technology,
                        role: this.osdecPro[i].role,
                        description: this.osdecPro[i].description,
                        type: this.osdecPro[i].type,
                        starting_date: date,
                        ending_date: date2,
                        agency: this.osdecPro[i].agency,
                        user: this.userObj
                    })

                }
            }
        )


        this.profileForm = new FormGroup({
            name: new FormControl('', Validators.required),
            phoneNo: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            position: new FormControl('', Validators.required),
            grade: new FormControl('', Validators.required),
            schema: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            state: new FormControl(),
            city: new FormControl(),
            postcode: new FormControl('', Validators.required),
            new_password: new FormControl(''),
            old_password: new FormControl('')

        });

        this.settingForm = new FormGroup({
            new_password: new FormControl('', Validators.required),
            old_password: new FormControl('', Validators.required),
            rpassword: new FormControl('', Validators.required)
        });

        this.projectForm = new FormGroup({
            name: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            techLs: new FormControl(),
            role: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            agencyOs: new FormControl(),
            starting_date: new FormControl(),
            ending_date: new FormControl()
        });

        this.technologyForm = new FormGroup({
            name: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            language: new FormControl('', Validators.required),
            status: new FormControl('', Validators.required)
        });

        this.agencyForm = new FormGroup({
            type: new FormControl('1'),
            agency: new FormControl(),
            name: new FormControl('0', Validators.required),
            code: new FormControl('', Validators.required),
            phoneNo: new FormControl({ value: '', disabled: true }),
            state: new FormControl({ value: '', disabled: true }),
            city: new FormControl({ value: '', disabled: true }),
            address: new FormControl({ value: '', disabled: true }),
            postcode: new FormControl({ value: '', disabled: true }),
            cname: new FormControl('', Validators.required),
            cphoneNo: new FormControl('', Validators.required),
            cstate: new FormControl('', Validators.required),
            ccity: new FormControl('', Validators.required),
            caddress: new FormControl('', Validators.required),
            cpostcode: new FormControl('', Validators.required),
        });

        this.picForm = new FormGroup({
            avatar: new FormControl()
        });

        this.certForm = new FormGroup({
            name: new FormControl('', Validators.required),
            type: new FormControl('', Validators.required),
            cert: new FormControl()
        });

        this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
        this.id = this.currentUser.id;

        // Load user by id to edit
        if (this.id) { //edit form
            this.userService.getUserById(this.id).subscribe(
                user => {
                    this.id = user.id;
                    this.userObj = user;

                    var stateId = "0";
                    var cityId = "0";

                    var state = user.state;
                    var city = user.city;
                    var grade = user.grade;
                    var schema = user.schema;

                    var gradeId = "0";
                    var schemaId = "0";

                    if (state) {
                        stateId = user.state.id;
                    }
                    if (city) {
                        cityId = user.city.id;
                    }

                    var loadUserState = "0";
                    var loadUserCity = "0";

                    if (state) {
                        loadUserState = state.id;
                        if (loadUserState) {
                            this.countryService.getCity(loadUserState).subscribe(
                                data => {
                                    this.cities = data;
                                }
                            );
                        }
                    }

                    if (city) {
                        loadUserCity = city.id
                    }

                    if (grade) {
                        gradeId = user.grade.id;
                    }
                    if (schema) {
                        schemaId = user.schema.id;
                    }

                    //load profile
                    this.profileForm.patchValue({
                        name: user.name,
                        phoneNo: user.phoneNo,
                        username: user.username,
                        email: user.email,
                        position: user.position,
                        grade: gradeId,
                        schema: schemaId,
                        address: user.address,
                        state: loadUserState,
                        city: loadUserCity,
                        postcode: user.postcode,
                        new_password: user.new_password,
                        old_password: user.old_password
                    });

                    this.name = user.name;
                    this.email = user.email;

                    //load image
                    this.imageSrc = "data:image/JPEG;base64," + user.image;

                    //agency loading
                    this.agencyGlobal = user.agency;

                    //company loading
                    this.companyGlobal = user.company;

                    var type = user.type;

                    if (type === "GOV") {
                        this.agencyForm.get('type').setValue('1');
                        this.isGov = true;
                    } else {
                        this.agencyForm.get('type').setValue('0');
                        this.isGov = false;
                    }

                    if (this.companyGlobal) {
                        this.companyId = user.company.id;

                        state = this.companyGlobal.state;
                        var loadState = "0";
                        var loadCity = "0";

                        if (state) {
                            loadState = state.id;
                            if (loadState) {
                                this.countryService.getCity(loadState).subscribe(
                                    data => {
                                        this.ccities = data;
                                    }
                                );
                            }
                        }

                        city = this.companyGlobal.city;
                        if (city) {
                            loadCity = city.id
                        }


                        this.agencyForm.patchValue({
                            cname: this.companyGlobal.name,
                            cphoneNo: this.companyGlobal.phoneNo,
                            caddress: this.companyGlobal.address,
                            cstate: loadState,
                            ccity: loadCity,
                            cpostcode: this.companyGlobal.postcode
                        })
                    }

                    if (this.agencyGlobal) {

                        var agencyState = "";
                        var agencyCity = "";

                        if (this.agencyGlobal.state) {
                            agencyState = this.agencyGlobal.state.name;
                            if (agencyState) {
                                agencyCity = this.agencyGlobal.city.name;
                            }
                        }

                        this.agencyForm.patchValue({
                            name: this.agencyGlobal.id,
                            phoneNo: this.agencyGlobal.phoneNo,
                            address: this.agencyGlobal.address,
                            state: agencyState,
                            city: agencyCity,
                            postcode: this.agencyGlobal.postcode
                        })
                    }

                    //load skill
                    let skills = user.skill;
                    if (skills) {
                        var optionHtml;
                        var optLvl = '<option value="0" selected>Pilih Tahap</option>';

                        for (let skill of skills) {

                            optionHtml = '<option value="0">Pilih Kepakaran</option>';

                            var id = skill.id;
                            var tech = skill.technology;
                            var level = skill.level;
                            var mark = skill.mark;

                            for (let obj of this.technologyLs) {
                                if (obj.id == tech.id) {
                                    optionHtml += '<option value="' + obj.id + '" selected>' + obj.name + '</option>';
                                } else {
                                    optionHtml += '<option value="' + obj.id + '">' + obj.name + '</option>';
                                }
                            }

                            if (level) {
                                if (level == "Permulaan") {
                                    optLvl = + ' <option value="Permulaan" selected>Permulaan</option>' +
                                        ' <option value="Pertengahan">Pertengahan</option>' +
                                        ' <option value="Mahir">Mahir</option>';
                                } else if (level == "Pertengahan") {
                                    optLvl = + '<option value="Permulaan" >Permulaan</option>' +
                                        ' <option value="Pertengahan" selected>Pertengahan</option>' +
                                        ' <option value="Mahir">Mahir</option>';
                                } else if (level == "Mahir") {
                                    optLvl = + ' <option value="Permulaan" >Permulaan</option>' +
                                        ' <option value="Pertengahan">Pertengahan</option>' +
                                        ' <option value="Mahir" selected>Mahir</option>';
                                }
                            }

                            var html = '<div id="sec-' + id + '" class="form-group row align-items-center"> ' +
                                '<div class="col-lg-4">' +
                                '  <select id="' + id + '" class="sbSkill form-control m-input" >' +
                                optionHtml +
                                '  </select>' +
                                '</div>' +
                                '<div class="col-lg-2">' +
                                '  <select class="form-control m-input m-input--solid sbLevel">' +
                                optLvl +
                                '  </select>' +
                                '</div>' +
                                '<div class="col-lg-1">' +
                                '  <div class="col-md-1">' +
                                '    <a class="m--font-danger deleteFn" ><i style="margin-top:7px" class="la la-trash"></i></a>' +
                                '  </div>' +
                                '</div>' +
                                '<div class="col-lg-2">' +
                                '<i class="la la-certificate m--font-warning size-2"></i>' +
                                mark + '%' +
                                '</div>' +
                                '<div id="error-' + id + '" style="display:none" class="skillError col-lg-10 m--font-danger">Kemahiran yang dipilih adalah sama, sila tukar atau padam kemahiran</div>' +
                                '</div>';

                            $("#skills").append(html);
                        }
                    }

                }, error => {
                    console.log(error);
                }
            );
        }
    }

    ngAfterViewInit() {
        this._script.load(
            '.m-grid__item.m-grid__item--fluid.m-wrapper',
            // 'assets/osdec/validation/user-val.js',
            'assets/osdec/validation/userSetting-val.js',
            'assets/osdec/validation/project-val.js',
            'assets/osdec/validation/validation.js'

        );

        $(document).on('click', '.deleteFn', (e) => {
            e.preventDefault();
            var id = $(e.target).parent().parent().parent().parent().attr('id');

            $("#" + id).slideUp('fast', function() {
                $("#" + id).remove();
            });
        });

        $(document).on('change', '.sbSkill', (e) => {
            let skillArr: any[] = new Array();
            var id = $(e.target).attr('id');
            var value = $("#" + id).val();

            if (value != "0") {
                var $sbSkill = $(".sbSkill");
                $sbSkill.each(function(i) {
                    skillArr.push($(this).val());
                });
                var index = skillArr.indexOf(value, 0);
                if (index > -1) {
                    skillArr.splice(index, 1);
                }

                var idDiv = "error-" + id;
                if ($.inArray(value, skillArr) != -1) {
                    this.isSkillValid = true;
                    $("#" + idDiv).show();
                } else {
                    this.isSkillValid = false;
                    $("#" + idDiv).hide();
                }
            }
        });


        //load certificate for user
        if (this.id) {
            this.certificateService.getCertificateByUser(this.id).subscribe(
                certLs => {
                    this.certificateLs = certLs;
                }
            );
        }
    }

    onSubmit() {
    }

    myProfile() {

        var userType = "PRIVATE"
        if (this.isGov) {
            userType = "GOV";
        }

        var form = $('#profileForm');

        form.validate({
            rules: {
                username: "required",
                name: "required"
            }
        });

        if (!form.valid() && !this.profileForm.valid) {
            return false;
        } else {
            if (this.id) {
                let user: User = new User(

                    this.id,
                    this.profileForm.controls['username'].value,
                    this.profileForm.controls['name'].value,
                    this.profileForm.controls['email'].value,
                    null,
                    null,
                    this.profileForm.controls['address'].value,
                    this.profileForm.controls['position'].value,
                    this.profileForm.controls['postcode'].value,
                    this.profileForm.controls['phoneNo'].value,
                    null,
                    null,
                    null,
                    null,
                    this.state,
                    this.city,
                    this.grade,
                    this.schema, null, userType, null
                );

                this.userService.updateUserProfile(user).subscribe(
                    sucess => {
                        toastr.success(message.global.success);
                    }
                );
            }
        }
    }

    mySetting() {

        var form = $('#settingForm');

        form.validate({
            rules: {
                old_password: "required",
                rpassword: {
                    required: true,
                    equalTo: "#old_password"
                },
                new_password: {
                    required: true
                }
            }
        });

        if (!form.valid()) {
            return false;
        } else {
            if (this.id) {
                let user: User = new User(
                    this.id,
                    null,
                    null,
                    null,
                    null,
                    this.settingForm.controls['old_password'].value,
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
                    null, null, null);
                this.userService.updateUserSetting(user).subscribe(
                    success => {
                        //  this.settingForm.get('new_password').setValue("");
                        //  this.settingForm.get('old_password').setValue("");
                        //  this.settingForm.get('rpassword').setValue("");
                        form.validate().resetForm();      // clear out the validation errors
                        form[0].reset();
                        toastr.success(message.global.success);
                    }
                );
            }
        }
    }

    myProject() {
        if (this.projectForm.valid) {

            let ngbDate = this.projectForm.controls['starting_date'].value;
            let date = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
            let ngbDate2 = this.projectForm.controls['ending_date'].value;
            let date2 = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);

            this.osdecProject.push({

                name: this.projectForm.controls['name'].value,
                technology: this.technology,
                role: this.projectForm.controls['role'].value,
                description: this.projectForm.controls['description'].value,
                type: this.projectForm.controls['type'].value,
                agency: this.agencyPrOs,
                starting_date: date,
                ending_date: date2,
                user: this.userObj

            });

            this.newLs.push({

                name: this.projectForm.controls['name'].value,
                technology: this.technology,
                role: this.projectForm.controls['role'].value,
                description: this.projectForm.controls['description'].value,
                type: this.projectForm.controls['type'].value,
                agency: this.agencyPrOs,
                starting_date: date,
                ending_date: date2,
                user: this.userObj

            });

            this.projectForm.reset();
            this.redirectProfilePage();
            $("m_modal_projek_osdec").modal("hide");

        }
    }


    submitProject() {

        this.loading = true;

        for (var i = 0; i < this.newLs.length; ++i) {
            if (this.newLs[i].id == null) {
                let project: Project = new Project(

                    null,
                    this.newLs[i].name,
                    this.technology,
                    this.newLs[i].role,
                    this.newLs[i].description,
                    this.newLs[i].type,
                    this.newLs[i].starting_date,
                    this.newLs[i].ending_date,
                    this.agencyPrOs,
                    this.userObj
                )

                this.projectService.createProjects(project).subscribe(
                    success => {
                        this.loading = false;
                        toastr.success(this.message.success);
                    }
                );
            }
            else {
                for (var j = 0; j < this.oldLs.length; ++j) {
                    if (this.newLs[i].id == this.oldLs[j].id) {
                        this.oldLs.splice(j, 1);
                    }
                }
            }
        }

        for (var i = 0; i < this.oldLs.length; ++i) {
            this.projectService.deleteProjectByUserId(this.oldLs[i].id).subscribe();
        }

    }

    deletePr(index) {
        this.osdecProject.splice(index, 1);
        this.newLs.splice(index, 1);
    }

    myAgency() {

        if (this.id) {
            var type = "";
            if (this.isGov === true) {
                this.loading = true;
                type = "GOV";
                let user: User = new User(


                    this.id,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    this.agency,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null, null, type, null
                );

                this.userService.updateUserAgency(user).subscribe(
                    sucess => {
                        this.loading = false;
                        toastr.success(message.global.success);
                    }
                );
            } else {
                this.loading = true;
                var form = $('#agencyForm');

                form.validate({
                    rules: {
                        cname: "required",
                        cphoneNo: "required",
                        caddress: "required",
                        cpostcode: {
                            required: true,
                            digits: true
                        },
                        cstate: "required"
                    }
                });

                if (!form.valid()) {
                    this.loading = false;
                    return false;
                } else {
                    type = "PRIVATE";
                    let company: Company = new Company(
                        this.companyId,
                        this.agencyForm.controls['cname'].value,
                        this.agencyForm.controls['cphoneNo'].value,
                        this.agencyForm.controls['caddress'].value,
                        this.ccity,
                        this.cstate,
                        this.agencyForm.controls['cpostcode'].value
                    );


                    let user: User = new User(

                        this.id,
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
                        null,
                        null,
                        null,
                        null,
                        null, null, type, company
                    );

                    this.userService.updateUserAgency(user).subscribe(
                        sucess => {
                            this.loading = false;
                            toastr.success(message.global.success);
                        }
                    );
                }
            }
        }
    }

    setSBState(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentState = this.stateLs.filter(value => parseInt(value.id) === parseInt(id));
        this.state = this.currentState[0];

        //load city based on state
        this.countryService.getCity(id).subscribe(
            data => {
                this.cities = data;
            }
        );
    }

    setSBCity(id: any): void {
        // Match the selected ID with the ID's in array
        this.currentCity = this.cities.filter(value => parseInt(value.id) === parseInt(id));
        this.city = this.currentCity[0];

    }

    setSBCState(id: any): void {
        // Match the selected ID with the ID's in array
        this.ccurrentState = this.stateLs.filter(value => parseInt(value.id) === parseInt(id));
        this.cstate = this.ccurrentState[0];

        //load city based on state
        this.countryService.getCity(id).subscribe(
            data => {
                this.ccities = data;
            }
        );
    }

    setSBCCity(id: any): void {
        // Match the selected ID with the ID's in array
        this.ccurrentCity = this.ccities.filter(value => parseInt(value.id) === parseInt(id));
        this.ccity = this.ccurrentCity[0];

    }

    setGrade(gradeId: any): void {

        this.currentGrade = this.gradeLs.filter(value => value.id === gradeId)
        this.grade = this.currentGrade[0];

    }

    setSchema(schemaId: any): void {

        this.currentSchema = this.schemaLs.filter(value => value.id === schemaId)
        this.schema = this.currentSchema[0];

    }

    setTech(valueId: string): void {
        this.currentTech = this.techLs.filter(value => value.id === valueId)
        this.technology = this.currentTech[0];

    }

    setAgency(valueId: string): void {
        this.currentAgency = this.agencyLs.filter(value => value.id === valueId)
        this.agencyUser = this.currentAgency[0];

        //set all value
        this.agencyService.getAgencyById(valueId).subscribe(
            agency => {

                this.agency = agency;
                this.agencyForm.patchValue({

                    code: agency.code,
                    phoneNo: agency.phoneNo,
                    state: agency.state.name,
                    city: agency.city.name,
                    address: agency.address,
                    postcode: agency.postcode

                });
            }, error => {
                console.log(error);
            }
        );


    }

    setAgencyOs(valueId: string): void {
        this.currentAgencyO = this.agencyOs.filter(value => value.id === valueId)
        this.agencyPrOs = this.currentAgencyO[0];

        this.agencyService.getAgencyById(valueId).subscribe(
            agency => {

                this.agencyPrOs;

                this.agency = agency;
                this.agencyForm.patchValue({

                    code: agency.code,
                    phoneNo: agency.phoneNo,
                    state: agency.state.name,
                    city: agency.city.name,
                    address: agency.address,
                    postcode: agency.postcode

                });
            }, error => {
                console.log(error);
            }
        );

    }



    redirectProfilePage() {
        this.router.navigate(['/header/profile']);
    }

    redirectAgencyPage() {
        this.router.navigate(['/agency/list']);
    }

    fileCertChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        } else {
            this.fileName = file.name;
            reader.readAsDataURL(file);
            this.certForm.get('cert').setValue(file);
        }
    }

    submitCert() {
        this.loading = true;

        let input = new FormData();

        let certObj = new Certificate(
            null,
            this.certForm.get('name').value,
            this.certForm.get('type').value,
            null,
            this.currentUser,
        );

        input.append('cert', this.certForm.get('cert').value);
        input.append('info', new Blob([JSON.stringify(certObj)],
            {
                type: "application/json"
            }));

        const formModel = input;
        this.userService.updateCertFile(formModel).subscribe(
            success => {

                toastr.success(message.global.success);
                this.loading = false;
                jQuery('#m_modal_add').modal('hide');
                window.location.reload();

            }
        );
    }

    handleInputChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
            toastr.danger(message.global.invalidFormatImage);
            return;
        }

        this.loaded = false;

        this.picForm.get('avatar').setValue(file);
        //console.log(this.picForm.get('avatar').value);

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);

        //save direct to db
        let input = new FormData();
        input.append('avatar', this.picForm.get('avatar').value);
        input.append('info', this.id);

        const formModel = input;

        this.userService.updateProfilePicture(formModel).subscribe();
    }

    handleImageLoad() {
        this.imageLoaded = true;
    }

    _handleReaderLoaded(e) {
        var reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
    }

    addSkill() {
        var rand = Math.floor((Math.random() * 10000) + 1);
        var idDefault = rand;

        var html = this.generateSkillHTML(idDefault);

        var new_div = $(html).hide();
        $("#skills").append(new_div);
        new_div.slideDown();

    }

    generateSkillHTML(id) {
        var optionHtml = '<option value="0">Pilih Kepakaran</option>';

        for (let tech of this.technologyLs) {
            optionHtml += '<option value="' + tech.id + '">' + tech.name + '</option>';
        }

        var html = '<div id="sec-' + id + '" class="form-group row align-items-center"> ' +
            '<div class="col-lg-4">' +
            '  <select id="' + id + '" class="sbSkill form-control m-input" >' +
            optionHtml +
            '  </select>' +
            '</div>' +
            '<div class="col-lg-2">' +
            '  <select class="form-control m-input m-input--solid sbLevel">' +
            '    <option value="0">Pilih Tahap</option>' +
            '    <option value="Permulaan">Permulaan</option>' +
            '    <option value="Pertengahan">Pertengahan</option>' +
            '    <option value="Mahir">Mahir</option>' +
            '  </select>' +
            '</div>' +
            '<div class="col-lg-2">' +
            '  <div class="col-md-1">' +
            '    <a class="m--font-danger deleteFn" ><i style="margin-top:7px" class="la la-trash"></i></a>' +
            '  </div>' +
            '</div>' +
            '<div id="error-' + id + '" style="display:none" class="skillError col-lg-10 m--font-danger">Kemahiran yang dipilih adalah sama, sila tukar atau padam kemahiran</div>' +
            '</div>';

        return html;
    }

    getFormSkill($event) {
        $event.preventDefault();

        let resultLs: any[] = new Array();
        let skillArr: any[] = new Array();
        let lvlArr: any[] = new Array();

        var isValid = false;

        var $sbSkill = $(".sbSkill");
        $sbSkill.each(function(i) {
            skillArr.push($(this).val());
        });

        var $sbLevel = $(".sbLevel");
        $sbLevel.each(function(i) {
            lvlArr.push($(this).val());
        });

        if (($.inArray("0", skillArr) == -1) && ($.inArray("0", lvlArr) == -1)) {
            isValid = true;
        }

        if (isValid) {
            this.loading = true;

            for (var i = 0; i < skillArr.length; i++) {
                let technology: any;
                var techId = skillArr[i];
                technology = this.technologyLs.filter(value => value.id === techId);

                let obj: Skill = new Skill(
                    null,
                    technology[0],
                    lvlArr[i],
                    this.currentUser,
                    null
                )
                resultLs.push(obj);
            }
            this.isSkillValid = false;

            this.skillService.createSkills(resultLs).subscribe(
                success => {
                    toastr.success(this.message.success);
                    this.loading = false;
                }
            );
            return resultLs;
        } else {
            this.isSkillValid = true;
        }
    }

    radTypeClick() {
        var type = this.agencyForm.controls['type'].value;
        if (type === "0") {
            this.isGov = false;
        } else {
            this.isGov = true;
        }
    }

    downloadFile(instanceId) {
        this.filestorageService.loadByInstance(instanceId).subscribe(
            obj => {

                var sampleArr = this.base64ToArrayBuffer(obj.content);

                var blob = new Blob([sampleArr]);
                var url = window.URL.createObjectURL(blob);
                window.open(url);
            }
        );
    }

    downloadCertificate(storageObj) {
        var data = this.base64ToArrayBuffer(storageObj.content);

        var blob = new Blob([data]);
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    deleteCertificate(id) {
        jQuery('#m_modal_cert').modal('show');
        this.fileCertId = id;
    }

    cerConfirmDelete($event) {
        $event.preventDefault();
        var id = this.fileCertId;
        if (id) {
            this.certificateService.deleteCertificateById(id).subscribe(
                success => {
                    toastr.success(message.global.successDelete);
                    window.location.reload();
                }
            );
        }
    }

    base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

}
