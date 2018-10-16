import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../model/user';
import { UserService } from '../../../../../services/user.service';
import { Technology } from '../../../../../model/setup/technology';
import { Certification } from '../../../../../model/certification/certification';
import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';
import { TechnologyService } from '../../../../../services/setup/technology.service';
import { environment } from "../../../../../../environments/environment";
import { Manday } from '../../../../../model/setup/manday';
import { MandayTransaction } from '../../../../../model/setup/mandayTransaction';
import { MandayService } from '../../../../../services/setup/manday.service';

import { NgbDatepickerConfig, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateFRParserFormatter } from "../../../../../_directives/ngb-date-fr-parser-formatter"

declare var $: any;
declare let toastr: any;
declare var jQuery: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-setting.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService, UserService, TechnologyService, MandayService, { provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class CertSettingComponent implements OnInit, AfterViewInit, OnDestroy {
    model;
    minDate: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    maxDate: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    endMin: NgbDateStruct = { year: 1950, month: 1, day: 1 };
    startMax: NgbDateStruct = { year: 2099, month: 12, day: 31 };

    certification: Certification;
    id: string;
    certTemp: Certification;
    certUserTemp: CertificationUser;
    loading: boolean = false;
    isEditable = false;

    message: any = {
        success: "Maklumat telah berjaya disimpan",
        update: "Maklumat telah berjaya dikemaskini",
    }

    manday: any;
    manday2: any;
    mandayUsed: any;
    mandayId: string;
    usedManday: number;
    mandayObj: any;

    databaseLs: any[];
    bearToken: string;

    technology: Technology;
    user: User;

    technologies: any[];
    currentTechnology: any;

    certForm: FormGroup;
    private sub: any;
    private userArray = [];
    private currentUser = [];
    private tempUser = [];

    @ViewChild('fileInput') fileInput;
    imageSrc: string = '';
    imageLoaded: boolean = false;
    loaded: boolean = false;
    errAvatar: boolean = false;

    confirmType: string = "success";
    confirmMsg: string;

    constructor(private _script: ScriptLoaderService,
        private certificationService: CertificationService,
        private userService: UserService,
        private technologyService: TechnologyService,
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
            this.certForm.get('avatar').setValue(file);
        }
    }

    clearFile() {
        this.certForm.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }


    ngOnInit() {

        this.bearToken = "Bearer " + localStorage.getItem('jwtToken');

        this.technologyService.getTechnology().subscribe(
            success => {
                this.technologies = success;
            }
        );

        this.mandayService.getManday().subscribe(
            data => {
                this.manday = data;
                this.manday2 = this.manday.filter(value => value.category === 'certificate');
                this.mandayObj = this.manday2[0];
            }

        );


        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.certForm = new FormGroup({
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

        //Load cert by id to edit
        if (this.id) { //edit form
            this.isEditable = true;

            this.certificationService.getCertificationById(this.id).subscribe(
                cert => {

                    var startDate = new Date(cert.startDate);
                    var endDate = new Date(cert.endDate);
                    var techId = "";
                    var tech = cert.technology;
                    this.technology = cert.technology;
                    if (tech) {
                        techId = tech.id;
                    }
                    this.imageSrc = "data:image/JPEG;base64," + cert.image;
                    this.id = cert.id;
                    this.certForm.patchValue({
                        title: cert.title,
                        technology: techId,
                        user: cert.user,
                        startDate: { year: startDate.getFullYear(), month: startDate.getMonth() + 1, day: startDate.getDate() },
                        endDate: { year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate() },
                        place: cert.place,
                        level: cert.level,
                        status: cert.status,
                        remark: cert.remark,
                        limitation: cert.limitation,

                    });

                    if (techId) {
                        this.setTechnology(techId);
                    }
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
            'assets/osdec/validation/certification/cert-val.js', 'assets/osdec/validation/validation.js');

    }

    setTechnology(id: any): void {
        this.currentTechnology = this.technologies.filter(value => value.id === id);
        this.technology = this.currentTechnology[0];
    }

    onSubmit() {

        var form = $('#certForm');

        form.validate({
            rules: {
                startDate: "required",
                endDate: "required"
            }
        });


        if (!form.valid()) {
            return false;
        } else {
            if (this.certForm.valid) {

                let currentUser = JSON.parse(localStorage.getItem('currentUser'));

                let ngbDate = this.certForm.controls['startDate'].value;
                let ngbDate2 = this.certForm.controls['endDate'].value;
                let startdate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
                let enddate = new Date(ngbDate2.year, ngbDate2.month - 1, ngbDate2.day);

                if (this.id) {
                    let certification: Certification = new Certification(
                        this.certForm.controls['title'].value,
                        this.technology,
                        this.user,
                        //this.certForm.controls['duration'].value,
                        startdate,
                        enddate,
                        this.certForm.controls['place'].value,
                        this.certForm.controls['level'].value,
                        this.certForm.controls['status'].value,
                        this.certForm.controls['remark'].value,
                        this.id,
                        null,
                        null,
                        currentUser.id,
                        this.certForm.controls['limitation'].value
                    );

                    let input = new FormData();
                    input.append('avatar', this.certForm.get('avatar').value);
                    input.append('info', new Blob([JSON.stringify(certification)],
                        {
                            type: "application/json"
                        }));

                    const formModel = input;

                    this.certificationService.updateCertification(formModel).subscribe(
                        success => {
                            this.redirectCertPage();
                            this.isEditable = true;
                            this.loading = false;
                            toastr.success(this.message.update);
                        }
                    )

                } else {
                    let certification: Certification = new Certification(
                        this.certForm.controls['title'].value,
                        this.technology,
                        this.user,
                        //this.certForm.controls['duration'].value,
                        startdate,
                        enddate,
                        this.certForm.controls['place'].value,
                        this.certForm.controls['level'].value,
                        this.certForm.controls['status'].value,
                        this.certForm.controls['remark'].value,
                        null,
                        null,
                        currentUser.id,
                        null,
                        this.certForm.controls['limitation'].value,

                    );

                    let input = new FormData();
                    input.append('avatar', this.certForm.get('avatar').value);
                    input.append('info', new Blob([JSON.stringify(certification)],
                        {
                            type: "application/json"
                        }));

                    const formModel = input;

                    this.certificationService.createCertification(formModel).subscribe(
                        data => {

                            this.certTemp = data;

                            let manday: MandayTransaction = new MandayTransaction(
                                'Persijilan',
                                this.certTemp.id,
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
                                            this.redirectCertPage();
                                            this.isEditable = true;
                                            this.loading = false;
                                            toastr.success(this.message.success);
                                        });
                                })
                        })
                }
            }
        }
    }

    redirectCertPage() {
        this.router.navigate(['/cert/listing']);
    }

    handleInputChange(e) {

        // if (event.target.files.length > 0) {
        //     let file = event.target.files[0];
        //     this.trainingForm.get('avatar').setValue(file);
        // }
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        this.loaded = false;

        this.certForm.get('avatar').setValue(file);

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
