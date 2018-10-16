import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AssesmentService } from '../../../../../services/assesment/assesment.service';
import { TechnologyService } from '../../../../../services/setup/technology.service';

import { Assesment } from '../../../../../model/assesment/assesment';
import { AssesmentAnswer } from '../../../../../model/assesment/assesmentAnswer';
import { AssesmentQuestion } from '../../../../../model/assesment/assesmentQuestion';
import { Technology } from '../../../../../model/setup/technology';

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./asses-setup.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService, TechnologyService]
})
export class AssesSetupComponent implements OnInit, AfterViewInit {

    assesForm: FormGroup;
    techLs: any[];
    answerLs: any[];

    assesAnswer: AssesmentAnswer;
    currentTech: any;
    tech: Technology;

    id: string;
    private sub: any;

    constructor(
        private assesmentService: AssesmentService,
        private technologyService: TechnologyService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.assesForm = new FormGroup({
            question: new FormControl('', Validators.required)
        });

        if (this.id) {//load form
            this.assesmentService.getQueById(this.id).subscribe(
                success => {

                    // var technology = success.technology;
                    // var techId = "";
                    // if(technology){
                    //   techId = technology.id;
                    // }

                    this.assesForm.patchValue({
                        question: success.question
                    });

                    //load array of answer options
                    if (success.assesmentAnswer != null) {
                        for (let obj of success.assesmentAnswer) {

                            var answer = obj.answer;
                            var checked = "";
                            if (answer) {
                                checked = "checked='checked'"
                            }

                            var html = '<div id="' + obj.id + '" class="form-group m-form__group row align-items-center"  style="margin-left:-40px">' +
                                '<div class="col-md-1"> ' +
                                '  <span class="m-switch m-switch--outline m-switch--icon m-switch--success"> ' +
                                '    <label> ' +
                                '      <input type="checkbox" ' + checked + ' name="" class="cbAnswer"> ' +
                                '      <span></span> ' +
                                '    </label> ' +
                                '  </span> ' +
                                '  <div class="d-md-none m--margin-bottom-10"></div> ' +
                                '</div> ' +
                                '<div class="col-md-6"> ' +
                                '  <div class="col-lg-12 col-md-12 col-sm-12"> ' +
                                '    <div class="m-form__control"> ' +
                                '      <input type="text" class="form-control m-input txtAnswer" placeholder="Sila Masukkan Jawapan" value="' + obj.option + '"> ' +
                                '    </div> ' +
                                '  </div> ' +
                                '  <div class="d-md-none m--margin-bottom-10"></div> ' +
                                '</div> ' +
                                '<div class="col-md-1"> ' +
                                '  <a class="m--font-danger deleteFn" ><i class="la la-close"></i></a> ' +
                                '</div> ' +
                                '</div> ';

                            $("#answerGrp").append(html);
                        }
                    }

                }

            );
        }
    }

    ngAfterViewInit() {

        $(document).on('click', '.deleteFn', (e) => {
            e.preventDefault();
            var id = $(e.target).parent().parent().parent().attr('id');

            $("#" + id).slideUp('fast', function() {
                $("#" + id).remove();
            });
        });

        this.technologyService.getTechnology().subscribe(
            success => {
                this.techLs = success;
            }
        );

        $(document).on('click', '.cbAnswer', (e) => {
            $(".cbAnswer").prop("checked", false);
            var id = $(e.target).parent().parent().parent().parent().attr('id');
            $("#" + id).children().children().children().children().prop("checked", true);
        });

    }

    addAnswer() {

        var rand = Math.floor((Math.random() * 10000) + 1);
        var id = "tempDivId-" + rand;

        var html = '<div id="' + id + '" class="form-group m-form__group row align-items-center"  style="margin-left:-40px">' +
            '<div class="col-md-1"> ' +
            '  <span class="m-switch m-switch--outline m-switch--icon m-switch--success"> ' +
            '    <label> ' +
            '      <input type="checkbox" name="" class="cbAnswer"> ' +
            '      <span></span> ' +
            '    </label> ' +
            '  </span> ' +
            '  <div class="d-md-none m--margin-bottom-10"></div> ' +
            '</div> ' +
            '<div class="col-md-6"> ' +
            '  <div class="col-lg-12 col-md-12 col-sm-12"> ' +
            '    <div class="m-form__control"> ' +
            '      <input type="text" class="form-control m-input txtAnswer" placeholder="Sila Masukkan Jawapan"> ' +
            '    </div> ' +
            '  </div> ' +
            '  <div class="d-md-none m--margin-bottom-10"></div> ' +
            '</div> ' +
            '<div class="col-md-1"> ' +
            '  <a class="m--font-danger deleteFn" ><i class="la la-close"></i></a> ' +
            '</div> ' +
            '</div> ';

        var new_div = $(html).hide();
        $("#answerGrp").append(new_div);
        new_div.slideDown();

    }

    getFormAnswer() {

        let resultLs: any[] = new Array();
        let cbArr: any[] = new Array();
        let ansArr: any[] = new Array();

        var $cbAnswer = $(".cbAnswer");
        $cbAnswer.each(function(i) {
            cbArr.push($(this).is(":checked"));
        });

        var $txtAnswer = $(".txtAnswer");
        $txtAnswer.each(function(i) {
            ansArr.push($(this).val());
        });

        for (var i = 0; i < ansArr.length; i++) {
            let obj: AssesmentAnswer = new AssesmentAnswer(
                null,
                ansArr[i],
                cbArr[i]
            )
            resultLs.push(obj);
        }

        return resultLs;
    }

    onSubmit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (this.id) {
            var techId = this.assesForm.controls['technology'].value;
            this.setSBTech(techId);

            let asses: AssesmentQuestion = new AssesmentQuestion(
                this.id,
                this.assesForm.controls['question'].value,
                this.getFormAnswer(),
                null
            );

            this.assesmentService.updateQue(asses).subscribe(
                success => {
                    this.redirectToList();
                }
            );

        } else {
            if (this.assesForm.valid) {

                let asses: AssesmentQuestion = new AssesmentQuestion(
                    null,
                    this.assesForm.controls['question'].value,
                    this.getFormAnswer(),
                    null
                );

                this.assesmentService.createQue(asses).subscribe(
                    success => {
                        this.redirectToList();
                    }
                );
            }
        }

    }

    redirectToList() {
        this.router.navigate(['/assesment/list']);
    }

    setSBTech(id: string) {
        this.currentTech = this.techLs.filter(value => value.id === id);
        this.tech = this.currentTech[0];
    }
}
