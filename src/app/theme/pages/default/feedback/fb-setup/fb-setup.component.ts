import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Feedback } from '../../../../../model/feedback/feedback';
import { FeedbackSection } from '../../../../../model/feedback/feedbackSection';
import { FeedbackSectionQuestion } from '../../../../../model/feedback/feedbackSectionQuestion';
import { FeedbackCollection } from '../../../../../model/feedback/feedbackCollection';
import { FeedbackService } from '../../../../../services/feedback/feedback.service';

import { message } from "../../../../../message/default";

declare var $: any;
declare var jQuery: any;
declare let toastr: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./fb-setup.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [FeedbackService]
})
export class FbSetupComponent implements OnInit, AfterViewInit {

    questionLs: any = new Array();
    sectionCount: number;
    fbForm: FormGroup;
    id: string;
    sub: any;

    feedbackObj: Feedback;
    sectionArr: any = new Array();
    questionArr: any = new Array();

    isExistSection: boolean = false;

    type: string;

    confirmMsg: string = message.global.confirmDelete;
    loading: boolean = false;

    constructor(
        private _script: ScriptLoaderService,
        private feedbackService: FeedbackService,
        private router: Router,
        private route: ActivatedRoute
    ) {

    }
    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
        });

        this.fbForm = new FormGroup({
            title: new FormControl("", Validators.required),
            objective: new FormControl("")
        });

        $(".m_selectpicker").selectpicker();

        $(document).on('click', '.actionBtnRm', (e) => {
            e.preventDefault();
            var id = $(e.target).parent().parent().parent().attr('id');

            //open modal
            jQuery('#m_modal_add').modal('show');
            $(document).on('click', '.modalOnConfirm', (e) => {
                e.preventDefault();
                $("#" + id).slideUp('fast', function() {
                    $("#" + id).remove();
                });
                let obj = new FeedbackSectionQuestion(
                    id,
                    null, null, null, null, null, null, null, null, null
                );
                var index = this.questionArr.findIndex(i => i.id === id);
                if (index === -1) {
                    this.questionArr.push(obj);
                }
                jQuery('#m_modal_add').modal('hide');
            });
        });

        $(document).on('click', '.actionBtnNew', (e) => {
            e.preventDefault();
            var id = $(e.target).attr('name');

            this.addQuestion(id);

        });

        $(document).on('click', '.actionBtnNewSection', (e) => {
            e.preventDefault();
            this.addSection();
        });

        $(document).on('click', '.actionBtnRmSection', (e) => {
            e.preventDefault();
            var id = $(e.target).parent().parent().parent().parent().parent().parent().attr('id');

            //open modal
            jQuery('#m_modal_add').modal('show');
            $(document).on('click', '.modalOnConfirm', (e) => {
                e.preventDefault();
                $("#" + id).slideUp('fast', function() {
                    $("#" + id).remove();
                });
                //remove button in section
                $('button[name="' + id + '"]').parent().parent().remove();
                let obj = new FeedbackSection(
                    id,
                    null, null
                );
                var index = this.sectionArr.findIndex(i => i.id === id);
                if (index === -1) {
                    this.sectionArr.push(obj);
                }
                jQuery('#m_modal_add').modal('hide');
            });
        });

        $(document).on('change', '.category', (e) => {
            e.preventDefault();
            var type = $(e.target).val();
            var id = $(e.target).parent().parent().parent().parent().attr('id');

            if (type === 'objektif') {
                $("#subjans-" + id).hide();
                $("#objans-" + id).show();
            } else if (type === 'subjektif') {
                $("#subjans-" + id).show();
                $("#objans-" + id).hide();
            } else if (type === 'subjobj') {
                $("#subjans-" + id).show();
                $("#objans-" + id).show();
            }
        });

        $(document).on("click", "span.editableText", (e) => {
            e.preventDefault();

            var txt = $.trim($(e.target).text());

            var html = '<div class="input-group editableInputDiv input-group-sm"> ' +
                '<input type="text" class="form-control editableInput" value="' + txt + '" placeholder="Bahagian...">' +
                '<span class="input-group-btn">' +
                '	<button class="btn btn-danger sectionLblActBtn" type="button">' +
                '		<i class="la la-check"></i>' +
                '	</button>' +
                '</span>' +
                '</div>';

            $(e.target).replaceWith(html);
        });

        $(document).on("click", ".sectionLblActBtn", (e) => {
            var txt = $(e.target).parent().prev().val();
            if (txt == "") {
                txt = "Bahagian";
            }
            $(e.target).parent().parent(".editableInputDiv").replaceWith("<span class='editableText'>" + txt + "</span>");
        });
    }

    ngAfterViewInit() {
        // this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
        //     'assets/osdec/utilities/autoresize.js');

        if (this.id) {
            this.feedbackService.load(this.id).subscribe(
                data => {
                    this.feedbackObj = data;

                    var section = data.feedbackSection;
                    if (section.length > 0) {
                        this.isExistSection = true;

                        //load question/section
                        this.loadQuestion(data);
                    } else {
                        //generate section as a initial
                        this.addSection();
                    }

                    //load all value
                    var typeDb = data.type;
                    if (typeDb == "PK") {
                        typeDb = "Penilaian Kursus"
                    } else if (typeDb == "PKK") {
                        typeDb = "Penilaian Keberkesanan Kursus"
                    } else if (typeDb == "PC") {
                        typeDb = "Penilaian Penceramah"
                    } else if (typeDb == "PBCP") {
                        typeDb = "Penilaian Berkala Coach Terhadap Peserta"
                    } else if (typeDb == "PBPC") {
                        typeDb = "Penilaian Berkala Peserta Terhadap Coach"
                    }

                    this.type = typeDb;

                    this.fbForm.patchValue({
                        title: data.title,
                        objective: data.objective
                    });
                }
            )
        }
    }

    onSubmit() {

        this.loading = true;

        if (this.fbForm.valid) {

            let fbObj = new Feedback(
                this.id,//id: string,
                this.fbForm.controls['title'].value,//title: string,
                this.fbForm.controls['objective'].value,//objective: string,
                null,//type: string,
                this.resettingSubmit(this.getAllInput()),//  feedbackSection: FeedbackSection[]
                null
            )

            let collObj = new FeedbackCollection(
                fbObj,
                this.sectionArr,
                this.questionArr,
                null,
                null,
                null
            )

            this.feedbackService.create(collObj).subscribe(
                success => {
                    this.loading = false;
                    toastr.success(message.global.success)
                },
                error => {
                    console.log(error);
                    this.loading = false;
                }
            );
        } else {
            this.loading = false;
            toastr.danger(message.global.failSave);
        }

    }

    getAllInput() {
        let arrHdSecId: any[] = new Array();
        let arrHdQueId: any[] = new Array();
        let arrQuestion: any[] = new Array();
        let arrType: any[] = new Array();
        let arrMinVal: any[] = new Array();
        let arrMinTxt: any[] = new Array();
        let arrMaxVal: any[] = new Array();
        let arrMaxTxt: any[] = new Array();
        let arrSectionTxt: any[] = new Array();
        let arrRs: any[] = new Array();

        $(".hdSecId").each(function(i) {
            arrHdSecId.push($(this).val());
        });
        $(".hdQueId").each(function(i) {
            arrHdQueId.push($(this).val());
        });
        $(".question").each(function(i) {
            arrQuestion.push($(this).val());
        });
        $('select[name="category"]').each(function(i) {
            arrType.push($(this).val());
        });
        $('select[name="minnum"]').each(function(i) {
            arrMinVal.push($(this).val());
        });
        $(".mintxt").each(function(i) {
            arrMinTxt.push($(this).val());
        });
        $('select[name="maxnum"]').each(function(i) {
            arrMaxVal.push($(this).val());
        });
        $(".maxtxt").each(function(i) {
            arrMaxTxt.push($(this).val());
        });
        $(".editableText").each(function(i) {
            arrSectionTxt.push($.trim($(this).text()));
        });

        for (var i = 0; i < arrHdSecId.length; i++) {
            let obj: any = {
                "id": arrHdQueId[i],
                "section": arrHdSecId[i],
                "sectionTxt": arrSectionTxt[i],
                "detail": {
                    "question": arrQuestion[i],
                    "type": arrType[i],
                    "minnum": arrMinVal[i],
                    "maxnum": arrMaxVal[i],
                    "maxtxt": arrMaxTxt[i],
                    "mintxt": arrMinTxt[i]
                }

            };

            arrRs.push(obj);
        }

        return arrRs;
    }

    getAllSection() {
        let arrHdSecId: any[] = new Array();
        let arrSectionTxt: any[] = new Array();
        let arrRs: any[] = new Array();

        $(".editableText").parent().parent().parent().parent().parent().parent().parent().each(function(i) {
            arrHdSecId.push($(this).attr("id"));
        });
        $(".editableText").each(function(i) {
            arrSectionTxt.push($.trim($(this).text()));
        });

        for (var i = 0; i < arrHdSecId.length; i++) {
            let obj: any = {
                "section": arrHdSecId[i],
                "sectionTxt": arrSectionTxt[i]
            };

            arrRs.push(obj);
        }

        return arrRs;
    }

    getSectionTxtById(sectionId) {

        let rsArr: any[] = new Array();
        var secLs = this.getAllSection();
        var result = "";

        for (let obj of secLs) {
            var objId = obj.section;
            var objtxt = obj.sectionTxt;
            if (objId === sectionId) {
                result = objtxt;
            }
        }

        return result;
    }

    resettingSubmit(arrLs) {
        let queArr: any[] = new Array();
        let sectionArr: any[] = new Array();

        for (let obj of arrLs) {
            var section = obj.section;

            let sectionObj = new FeedbackSection(
                section,
                this.getSectionTxtById(section),
                this.pushQuestion(arrLs, section)
            )

            var index = sectionArr.findIndex(i => i.id === section);
            if (index === -1) {
                sectionArr.push(sectionObj);
            }
        }
        return sectionArr;
    }

    pushQuestion(arrLs, sectionId) {

        let rsArr: any[] = new Array();

        for (let obj of arrLs) {
            var section = obj.section;
            var id = obj.id;
            var question = obj.detail.question;
            var type = obj.detail.type;
            var minnum = obj.detail.minnum;
            var maxnum = obj.detail.maxnum;
            var maxtxt = obj.detail.maxtxt;
            var mintxt = obj.detail.mintxt;

            let quesObj = new FeedbackSectionQuestion(
                id,//id: string,
                question,//title: string,
                type,//type: string,
                minnum,//min: number,
                maxnum,//max: number,
                mintxt,//minxlbl: string,
                maxtxt,//maxlbl: string,
                null,//detail: string,
                null,//user: User
                null
            )

            if (sectionId == section) {
                rsArr.push(quesObj);
            }
        }

        return rsArr;
    }

    addQuestion(sectionId) {

        var html = this.generateQuestion(sectionId, this.generateID(), "QUESTION");

        var new_div = $(html).hide();
        $("#" + sectionId).append(new_div);
        new_div.slideDown();

        $(".m_selectpicker").selectpicker('refresh');

    }

    addSection() {

        var html = this.generateQuestion("section-" + this.generateID(), this.generateID(), "SECTION");

        var new_div = $(html).hide();
        $("#baseId").append(new_div);
        new_div.slideDown();

        $(".m_selectpicker").selectpicker('refresh');

    }

    removeQue(arr, id) {
        var index = arr.findIndex(i => i.id === id);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return arr;
    }

    generateQuestion(sectionid, questionid, mode) {
        var result = '';

        var section1HTML = '<div id="' + sectionid + '">' +
            '<div class="m-portlet__head">' +
            '  <div class="m-portlet__head-caption">' +
            '    <div class="m-portlet__head-title " style="margin-left:-30px ">' +
            '      <h3 class="m-portlet__head-text">' +
            '        <label class="btn m-btn--square btn-outline-info active text-left" style="width: 241.667px;">' +
            '          <span>' +
            '            <span class="editableText">' +
            '              Bahagian' +
            '            </span>' +
            '          </span>' +
            '        </label>' +
            '      </h3>' +
            '      <div class="icon-middle">' +
            '         <i class="fa fa-info-circle m--font-danger" title="Sila klik pada bahagian untuk kemaskini"></i>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="m-portlet__head-tools">' +
            '      <ul class="m-portlet__nav">' +
            '      <li class="m-portlet__nav-item">' +
            '        <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon actionBtnNewSection">' +
            '          <i class="la la-plus"></i>' +
            '        </a>' +
            '      </li>' +
            '      <li class="m-portlet__nav-item">' +
            '        <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon actionBtnRmSection">' +
            '          <i class="la la-close"></i>' +
            '        </a>' +
            '      </li>' +
            '    </ul>' +
            '  </div>' +
            '</div>';

        var section2HTML = '</div>' +
            '<div class="form-group m-form__group row">' +
            '  <div class="col-form-label col-lg-5 col-sm-12">' +
            '    <button type="reset" name="' + sectionid + '" class="btn btn-info m-btn--icon actionBtnNew">' +
            '      <span>' +
            '        <i class="la la-plus"></i>' +
            '        <span>' +
            '          Tambah' +
            '        </span>' +
            '      </span>' +
            '    </button>' +
            '  </div>' +
            '</div>';

        var questionHTML = '<div id="' + questionid + '" class="hoverDiv p-3"> ' +
            '<div class="form-group m-form__group row">' +
            '  <label class="col-form-label col-lg-3 col-sm-12">' +
            '    Soalan' +
            '  </label>' +
            '  <div class="col-lg-5 col-md-5 col-sm-12">' +
            '    <textarea name="question" class="form-control m_autosize question" rows="2" ></textarea>' +
            '  </div>' +
            '  <div class="col-lg-2">' +
            '    <select name="category" class="form-control m-bootstrap-select m_selectpicker category" data-style="btn-primary" onClick=(i, this.val) >' +
            '      <option value="subjektif" data-icon="fa fa-indent">' +
            '        Subjektif' +
            '      </option>' +
            '      <option value="objektif"  data-icon="fa fa-circle-o">' +
            '        Objektif' +
            '        </option>' +
            '      <option value="subjobj"  data-icon="fa fa-list-ul">' +
            '        Objektif & Subjektif' +
            '        </option>' +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            ' <input name="hdSecId" class="hdSecId" type="hidden" value="' + sectionid + '">' +
            ' <input name="hdQueId" class="hdQueId" type="hidden" value="' + questionid + '">' +
            '  <div id="objans-' + questionid + '" style="display:none;" class="form-group m-form__group row objans">' +
            '    <label class="col-form-label col-lg-3 col-sm-12">' +
            '      Skala' +
            '    </label>' +
            '    <div class="col-lg-2 col-md-9 col-sm-12">' +
            '      <input name="mintxt" type="text" class="form-control m-input mintxt" placeholder="">' +
            '    </div>' +
            '    <div class="col-lg-1">' +
            '      <select name="minnum" class="form-control m-bootstrap-select m_selectpicker minnum" data-width="fit">' +
            '        <option value="1">' +
            '          1' +
            '        </option>' +
            '        <option value="2">' +
            '          2' +
            '        </option>' +
            '        <option value="3">' +
            '          3' +
            '        </option>' +
            '        <option value="4">' +
            '          4' +
            '        </option>' +
            '        <option value="5">' +
            '          5' +
            '        </option>' +
            '        <option value="6">' +
            '          6' +
            '        </option>' +
            '        <option value="7">' +
            '          7' +
            '        </option>' +
            '        <option value="8">' +
            '          8' +
            '        </option>' +
            '        <option value="9">' +
            '          9' +
            '        </option>' +
            '        <option value="10">' +
            '          10' +
            '        </option>' +
            '      </select>' +
            '    </div>' +
            '    <label class="col-form-label col-lg-1 col-sm-12">' +
            '      Hingga' +
            '    </label>' +
            '    <div class="col-lg-1">' +
            '      <select name="maxnum" class="form-control m-bootstrap-select m_selectpicker maxnum" data-width="fit">' +
            '        <option value="1">' +
            '          1' +
            '        </option>' +
            '        <option value="2">' +
            '          2' +
            '        </option>' +
            '        <option value="3">' +
            '          3' +
            '        </option>' +
            '        <option value="4">' +
            '          4' +
            '        </option>' +
            '        <option value="5">' +
            '          5' +
            '        </option>' +
            '        <option value="6">' +
            '          6' +
            '        </option>' +
            '        <option value="7">' +
            '          7' +
            '        </option>' +
            '        <option value="8">' +
            '          8' +
            '        </option>' +
            '        <option value="9">' +
            '          9' +
            '        </option>' +
            '        <option value="10">' +
            '          10' +
            '        </option>' +
            '      </select>' +
            '    </div>' +
            '    <div class="col-lg-2 col-md-9 col-sm-12">' +
            '      <input name="maxtxt" type="text" class="form-control m-input maxtxt" placeholder="">' +
            '    </div>' +
            '  </div>' +
            '' +
            '  <div id="subjans-' + questionid + '" class="form-group m-form__group row subjans">' +
            '    <label class="col-form-label col-lg-3 col-sm-12">' +
            '      Jawapan' +
            '    </label>' +
            '    <div class="col-lg-5 col-md-7 col-sm-12">' +
            '      <textarea cols="2" class="form-control m-input" type="text" placeholder="Jawapan subjektif penilaian.." disabled></textarea>' +
            '    </div>' +
            '  </div>' +
            '  <div class="form-group m-form__group row">' +
            '    <label class="col-form-label col-lg-4 col-sm-12">' +
            '    </label>' +
            '    <div class="col-form-label col-lg-5 col-sm-12 hideShowBtn">' +
            // '      <button type="reset" class="btn btn-success m-btn btn-sm m-btn m-btn--icon actionBtnAdd">'+
            // '        <span>'+
            // '          <i class="la la-plus"></i>'+
            // '          <span>'+
            // '            Tambah'+
            // '          </span>'+
            // '        </span>'+
            // '      </button>'+
            // '      &nbsp;&nbsp;'+
            '      <button type="reset" class="btn btn-danger m-btn btn-sm 	m-btn m-btn--icon actionBtnRm">' +
            '        <span>' +
            '          <i class="la la-trash"></i>' +
            '          <span>' +
            '            Hapus' +
            '          </span>' +
            '        </span>' +
            '      </button>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        if (mode === "QUESTION") {
            result = questionHTML;
        } else if (mode === "SECTION") {
            result += section1HTML;
            result += questionHTML;
            result += section2HTML;
        }

        return result;
    }

    generateID() {
        var length = 10;
        return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    }

    redirectToList() {
        this.router.navigate(['/feedback/list']);
    }

    loadQuestion(feedback) {
        var result = '';

        if (feedback) {
            var sectionLs = feedback.feedbackSection;

            for (let section of sectionLs) {

                var questionLs = section.feedbackSectionQuestion;
                var sectionTxt = section.title;
                var sectionId = section.id;

                result += this.getHtmlSectionHead(sectionId, sectionTxt);

                for (let question of questionLs) {
                    result += this.getHtmlQuestion(sectionId, question);
                }

                result += this.getHtmlSectionFoot(sectionId);
            }
        }

        //refresh plugin
        $("#baseId").append(result);
        $(".m_selectpicker").selectpicker('refresh');
    }

    getHtmlSectionHead(id, data) {
        var result = "";
        if (!data) {
            data = "Bahagian"

        }

        result = '<div id="' + id + '">' +
            '<div class="m-portlet__head">' +
            '  <div class="m-portlet__head-caption">' +
            '    <div class="m-portlet__head-title " style="margin-left:-30px ">' +
            '      <h3 class="m-portlet__head-text">' +
            '        <label class="btn m-btn--square btn-outline-info active text-left" style="width: 241.667px;">' +
            '          <span>' +
            '            <span class="editableText">' + data +
            '            </span>' +
            '          </span>' +
            '        </label>' +
            '      </h3>' +
            '    <div class="icon-middle">' +
            '       <i class="fa fa-info-circle m--font-danger" title="Sila klik pada bahagian untuk kemaskini"></i>' +
            '    </div>' +
            '    </div>' +
            '  </div>' +
            '  <div class="m-portlet__head-tools">' +
            '      <ul class="m-portlet__nav">' +
            '      <li class="m-portlet__nav-item">' +
            '        <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon actionBtnNewSection">' +
            '          <i class="la la-plus"></i>' +
            '        </a>' +
            '      </li>' +
            '      <li class="m-portlet__nav-item">' +
            '        <a href="" class="m-portlet__nav-link m-portlet__nav-link--icon actionBtnRmSection">' +
            '          <i class="la la-close"></i>' +
            '        </a>' +
            '      </li>' +
            '    </ul>' +
            '  </div>' +
            '</div>';

        return result;
    }

    getHtmlSectionFoot(id) {

        var section2HTML = '</div>' +
            '<div class="form-group m-form__group row">' +
            '  <div class="col-form-label col-lg-5 col-sm-12">' +
            '    <button type="reset" name="' + id + '" class="btn btn-info m-btn--icon actionBtnNew">' +
            '      <span>' +
            '        <i class="la la-plus"></i>' +
            '        <span>' +
            '          Tambah' +
            '        </span>' +
            '      </span>' +
            '    </button>' +
            '  </div>' +
            '</div>';

        return section2HTML;
    }

    getHtmlQuestion(sectionId, question) {
        var id = question.id;
        var result = '';
        var questionTitle = question.title;
        var type = question.type;
        var optionHTML = '';
        var scaleHTML = '';
        var freeHTML = '';
        var minVal = question.min;
        var minTxt = question.minlbl;
        var maxVal = question.max;
        var maxTxt = question.maxlbl;

        if (!maxTxt) {
            maxTxt = "";
        } if (!minTxt) {
            minTxt = "";
        }

        if (type === 'objektif') {
            optionHTML = ' <option value="subjektif" data-icon="fa fa-indent">' +
                '   Subjektif' +
                ' </option>' +
                ' <option value="objektif"  data-icon="fa fa-circle-o" selected>' +
                '    Objektif' +
                ' </option>' +
                ' <option value="subjobj"  data-icon="fa fa-list-ul">' +
                '    Objektif & Subjektif' +
                ' </option>';

            scaleHTML = '  <div id="objans-' + id + '" class="form-group m-form__group row objans">';
            freeHTML = '  <div id="subjans-' + id + '" style="display:none;" class="form-group m-form__group row subjans">';

        } else if (type === 'subjektif') {
            optionHTML = ' <option value="subjektif" data-icon="fa fa-indent" selected>' +
                '   Subjektif' +
                ' </option>' +
                ' <option value="objektif"  data-icon="fa fa-circle-o">' +
                '    Objektif' +
                ' </option>' +
                ' <option value="subjobj"  data-icon="fa fa-list-ul">' +
                '    Objektif & Subjektif' +
                ' </option>';

            scaleHTML = '  <div id="objans-' + id + '" style="display:none;" class="form-group m-form__group row objans">';
            freeHTML = '  <div id="subjans-' + id + '" class="form-group m-form__group row subjans">';

        } else if (type === 'subjobj') {
            optionHTML = ' <option value="subjektif" data-icon="fa fa-indent" >' +
                '   Subjektif' +
                ' </option>' +
                ' <option value="objektif"  data-icon="fa fa-circle-o">' +
                '    Objektif' +
                ' </option>' +
                ' <option value="subjobj"  data-icon="fa fa-list-ul" selected>' +
                '    Objektif & Subjektif' +
                ' </option>';

            scaleHTML = '  <div id="objans-' + id + '" class="form-group m-form__group row objans">';
            freeHTML = '  <div id="subjans-' + id + '" class="form-group m-form__group row subjans">';

        }

        result += '<div id="' + id + '" class="hoverDiv p-3"> ' +
            '<div class="form-group m-form__group row">' +
            '  <label class="col-form-label col-lg-3 col-sm-12">' +
            '    Soalan' +
            '  </label>' +
            '  <div class="col-lg-5 col-md-5 col-sm-12">' +
            '    <textarea name="question" class="form-control m_autosize question" rows="2" >' + questionTitle + '</textarea>' +
            '  </div>' +
            '  <div class="col-lg-2">' +
            '    <select name="category" class="form-control m-bootstrap-select m_selectpicker category" data-style="btn-primary" onClick=(i, this.val) >' +
            optionHTML +
            '      </select>' +
            '    </div>' +
            '  </div>' +
            ' <input name="hdSecId" class="hdSecId" type="hidden" value="' + sectionId + '">' +
            ' <input name="hdQueId" class="hdQueId" type="hidden" value="' + id + '">' +
            scaleHTML +
            '    <label class="col-form-label col-lg-3 col-sm-12">' +
            '      Skala' +
            '    </label>' +
            '    <div class="col-lg-2 col-md-9 col-sm-12">' +
            '      <input name="mintxt" type="text" value="' + minTxt + '" class="form-control m-input mintxt" placeholder="">' +
            '    </div>' +
            '    <div class="col-lg-1">' +
            '      <select name="minnum" class="form-control m-bootstrap-select m_selectpicker minnum" data-width="fit">' +
            this.getOptionHTML(minVal) +
            '      </select>' +
            '    </div>' +
            '    <label class="col-form-label col-lg-1 col-sm-12">' +
            '      Hingga' +
            '    </label>' +
            '    <div class="col-lg-1">' +
            '      <select name="maxnum" class="form-control m-bootstrap-select m_selectpicker maxnum" data-width="fit">' +
            this.getOptionHTML(maxVal) +
            '      </select>' +
            '    </div>' +
            '    <div class="col-lg-2 col-md-9 col-sm-12">' +
            '      <input name="maxtxt" type="text" value="' + maxTxt + '" class="form-control m-input maxtxt" placeholder="">' +
            '    </div>' +
            '  </div>' +
            '' +
            freeHTML +
            '    <label class="col-form-label col-lg-3 col-sm-12">' +
            '      Jawapan' +
            '    </label>' +
            '    <div class="col-lg-5 col-md-7 col-sm-12">' +
            '      <textarea cols="2" class="form-control m-input" type="text" placeholder="Jawapan subjektif penilaian.." disabled></textarea>' +
            '    </div>' +
            '  </div>' +
            '  <div class="form-group m-form__group row">' +
            '    <label class="col-form-label col-lg-4 col-sm-12">' +
            '    </label>' +
            '    <div class="col-form-label col-lg-5 col-sm-12 hideShowBtn">' +
            // '      <button type="reset" class="btn btn-success m-btn btn-sm m-btn m-btn--icon actionBtnAdd">'+
            // '        <span>'+
            // '          <i class="la la-plus"></i>'+
            // '          <span>'+
            // '            Tambah'+
            // '          </span>'+
            // '        </span>'+
            // '      </button>'+
            // '      &nbsp;&nbsp;'+
            '      <button type="reset" class="btn btn-danger m-btn btn-sm 	m-btn m-btn--icon actionBtnRm">' +
            '        <span>' +
            '          <i class="la la-trash"></i>' +
            '          <span>' +
            '            Hapus' +
            '          </span>' +
            '        </span>' +
            '      </button>' +
            '    </div>' +
            '  </div>' +
            '</div>';


        return result;
    }

    getOptionHTML(value) {
        var result = '';
        for (var i = 1; i < 11; i++) {
            if (value === i) {
                result += ' <option value="' + i + '" selected>' + i + '</option>';
            } else {
                result += ' <option value="' + i + '">' + i + '</option>';
            }

        }

        return result;
    }

}
