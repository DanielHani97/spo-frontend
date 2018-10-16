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
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { Training } from '../../../../../model/training/training';
import { TrainingService } from '../../../../../services/training/training.service';
import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service';

import { Company } from '../../../../../model/setup/company';

import { PasswordValidation } from '../../../../../../assets/osdec/validation/password-val';
import { AuthenticationService } from "../../../../../auth/_services/authentication.service";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./header-profile-view.component.html",
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
        TrainingService,
        CoachingService
    ]

})
export class HeaderProfileViewComponent implements OnInit, AfterViewInit {

    token: string;
    bearToken: string;
    user: User;

    agencyForm: FormGroup;
    agency: Agency;
    skill: any[];

    // project: Project;
    private osdecProject = [];
    private lainProject = [];
    project: Project;
    projectLs: any[];
    private osdecPro = [];

    userimg: any;
    // project: Project;
    latihan: any;
    latihanP: any[];

    // project: Project;
    coachingP: any;

    certificate: Certificate;

    id: string;
    agencyid: string;
    agencyGlobal: any;
    companyGlobal: any;
    userid: string;
    userObj: any;
    private sub: any;

    ccities: any[];

    city: City;
    state: State;

    grade: Grade;

    schema: Schema;
    form: FormGroup;

    name: String;
    email: String;
    username: String;
    phoneNo: any;
    address: any;
    position: String;
    type: String;
    agency2: String;
    postcode: any;
    state2: any;
    city2: any;
    ccity: any;
    cstate: any;
    caddress: any;
    cpostcode: any;
    cphoneNo: any;

    @ViewChild('fileInput') fileInput;
    imageSrc: string = '';
    imageLoaded: boolean = true;
    loaded: boolean = true;

    technologyLs: any[];

    isGov: boolean = true;

    companyId: string;

    //certificate file
    @ViewChild('fileCert') fileCert;

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
        private trainingService: TrainingService,
        private coachingService: CoachingService

    ) {

    }
    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

            this.trainingService.getTrainingTx().subscribe(
                data => {
                    this.latihan = data;
                    this.latihanP = this.latihan.filter(value => value.user.id === this.id);
                    console.log(this.latihanP)

                    let ngbDate = this.latihan.startDate;
                    var dateA = new Date(ngbDate)

                    let ngbDate2 = this.latihan.endDate;
                    var dateB = new Date(ngbDate2);
                }
            )

            this.coachingService.getCoachingUserByUserId(this.id).subscribe(
                data => {
                    this.coachingP = data;
                    console.log(data)

                    let ngbDate = this.coachingP.starting_date;
                    var dateA = new Date(ngbDate)

                    let ngbDate2 = this.coachingP.ending_date;
                    var dateB = new Date(ngbDate2);
                }
            )
        });

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

                    })
                }
            })

        //Load user by id to edit
        if (this.id) { //edit form
            this.userService.getUserById(this.id).subscribe(
                user => {
                    this.id = user.id;
                    this.userObj = user;
                    this.userimg = user.image;
                    this.skill = user.skill;

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

                    if (grade) {
                        gradeId = user.grade.id;
                    }
                    if (schema) {
                        schemaId = user.schema.id;
                    }

                    if (user.type == "GOV") {
                        this.type = "KERAJAAN"
                    } else if (user.type == "PRIVATE") {
                        this.type = "SWASTA"
                    }

                    this.name = user.name;
                    this.email = user.email;
                    this.phoneNo = user.phoneNo;
                    this.username = user.username;
                    this.position = user.position;
                    this.address = user.address;
                    this.agency2 = user.agency.name;
                    this.postcode = user.postcode;
                    this.state2 = user.state.name;
                    this.city2 = user.city.name;
                    this.caddress = user.agency.address;
                    this.cstate = user.agency.state.name;
                    this.ccity = user.agency.city.name;
                    this.cpostcode = user.agency.postcode;
                    this.cphoneNo = user.agency.phoneNo;

                    //agency loading
                    this.agencyGlobal = user.agency;

                    //company loading
                    this.companyGlobal = user.company;

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
                    }

                    //load skill
                    let skills = user.skill;
                    if (skills) {
                        var optionHtml;
                        var optLvl = '<option value="0"</option>';

                        for (let skill of skills) {

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
                        }
                    }

                }, error => {
                    console.log(error);
                }
            );
        }
    }

    ngAfterViewInit() {

    }

    onSubmit() {
    }

    backPage() {
        window.history.back();
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


