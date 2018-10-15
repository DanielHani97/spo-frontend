import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Agency } from '../../../../../model/setup/agency';
import { AssesmentService } from '../../../../../services/assesment/assesment.service';

import { environment } from "../../../../../../environments/environment";
import { Technology } from '../../../../../model/setup/technology';
import { TechnologyService } from '../../../../../services/setup/technology.service';

import { Assesment } from '../../../../../model/assesment/assesment'
import { AssesmentQuestion } from '../../../../../model/assesment/assesmentQuestion';
import { AssesmentAnswer } from '../../../../../model/assesment/assesmentAnswer';

declare let toastr:any;
declare var jQuery:any;

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./asses-que-list.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AssesmentService, TechnologyService]
})
export class AssesQueListComponent implements OnInit, AfterViewInit{

    datatable: any;


    token : string;
    bearToken : string;
    queForm: FormGroup;
    assesForm: FormGroup;

    techLs : any[];
    currentTech : any;
    tech : Technology;
    loading: boolean = false;

    id: string ;
    queId: string;
    isEditable = false;
    private sub: any;

    message: any = {
      success: "Maklumat telah berjaya disimpan"
    }

    error: any = {
      type: "danger",
      text: "Sila Penuhkan Ruangan Dengan Betul"
    }

    assesObj: Assesment;
    isErrAsses: boolean = false;

    constructor(private elRef: ElementRef,
      private router: Router,
      private route: ActivatedRoute,
      private assesmentService:AssesmentService,
      private _script: ScriptLoaderService,
      private technologyService: TechnologyService
    ) {}

    ngOnInit() {

      this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      });

      this.bearToken = "Bearer "+localStorage.getItem('jwtToken');

      this.queForm = new FormGroup({
        title: new FormControl('', Validators.required),
        //category: new FormControl('coaching'),
        technology: new FormControl('', Validators.required),
        level: new FormControl('', Validators.required),
        limit: new FormControl('0', Validators.required)
      })

      this.assesForm = new FormGroup({
        question: new FormControl('', Validators.required)
      });

      this.technologyService.getTechnology().subscribe(
        success => {
          this.techLs = success;
        }
      );

      //load assesment
      if(this.id){
        this.isEditable = true;

        this.assesmentService.getAssesmentById(this.id).subscribe(
          success=>{
            this.queForm.patchValue({
              title: success.title,
              //category: success.category,
              technology: success.technology.id,
              level: success.level,
              limit: success.questionno
            })

            this.setSBTech(success.technology.id);

            this.assesObj = success;
        });
      }
    }

    ngAfterViewInit() {

      this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper'
      //,'assets/osdec/general/assesment/nouislider.js'
    );

      var options = {
        data: {
            type: "remote",
            source: {
                read: {
                    url: environment.hostname+"/api/asses/que/list",
                    // params: {
                    //   id : this.id
                    // },
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
            textAlign: "center",
            selector: {
                class: "m-checkbox--solid m-checkbox--brand"
            }
        }, {
            field: "question",
            title: "Soalan",
            sortable: "asc",
            filterable: !1
        }, {
            field: "Actions",
            width: 110,
            title: "Actions",
            sortable: !1,
            overflow: "visible",
            template: function(t) {
                return '<a href="#" class="queModalFn m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill btn-outline-success" title="Edit details">\t\t\t\t\t\t\t<i class="la la-pencil"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t'+
                '<button id="'+t.id+'" class="deleteModalFn m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill btn-outline-danger" title="Delete">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</button>\t\t\t\t\t'
            }
        }]
      }

      this.datatable = (<any>$('#assesQueList')).mDatatable(options);
      if(this.id){
        this.datatable.setDataSourceParam("id", this.id);
        this.datatable.reload();
      }

      $(document).on('keyup', '#m_form_search', (e) => {
          var search = $("#m_form_search").val();
          this.datatable.setDataSourceParam("search", search);
          this.datatable.load();
      })

      $(document).on('click', '.deleteModalFn', (e) => {
        e.preventDefault();
        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        var newid = id.toString();

        if(confirm("Adakah anda pasti untuk menghapuskan soalan ini ?")) {
          this.assesmentService.deleteQueById(newid)
            .subscribe(
             successCode => {
                this.datatable.reload();
      	      });
        }

      });

      $(document).on('click', '.deleteQueFn', (e) => {
        e.preventDefault();
        var id = $(e.target).parent().parent().parent().attr('id');

        $("#"+id).slideUp('fast', function() {
          $("#"+id).remove();
        });
      });

      $(document).on('click', '.cbAnswer', (e) => {
        $(".cbAnswer").prop("checked", false);
        var id = $(e.target).parent().parent().parent().parent().attr('id');
        $("#"+id).children().children().children().children().prop("checked", true);
      });

      $(document).on('click', '.queModalFn', (e) => {
        e.preventDefault();
        var id = $(e.target).closest('.m-datatable__row').find('[data-field="id"]').find('.m-checkbox > input').val();
        var newid = id.toString();

        this.assesmentService.getQueById(newid).subscribe(
          success => {
            this.assesForm.patchValue({
              question: success.question
            });
            this.queId = success.id;
            this.loadQueForm(success.assesmentAnswer);
            console.log(this.queId);
            jQuery('#m_modal_add').modal('show');
          }
        )

      });

    }

    redirectNewAgencyPage() {
    this.router.navigate(['assesment/que/setup']);
  }

  setSBTech(id:string){
    this.currentTech = this.techLs.filter(value => value.id === id);
    this.tech = this.currentTech[0];
  }

  onSubmit(){
    var form = $('#queForm');
    form.validate({
      rules:{
        title: "required",
        technology: "required",
        level: "required",
        limit: {
          required: true,
          number: true
        }
      }
    });

    if(!form.valid() && !this.queForm.valid){
      return false;
    }else{
      this.loading = true;
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));

      let asses : Assesment = new Assesment(
        this.id,
        this.queForm.controls['title'].value,
        null,
        this.queForm.controls['level'].value,
        null,
        this.tech,
        null,
          this.queForm.controls['limit'].value,
        null,
        null,
        currentUser
      );

      if(this.id){
        this.assesmentService.updateAssesment(asses).subscribe(
          success => {
            this.assesObj = asses;
            this.isEditable = true;
            this.loading = false;
            this.isErrAsses = false;
            toastr.success(this.message.success);

          },
          error => {
            this.error.text = error;
            this.isErrAsses = true;
            this.loading = false;
          }
        );
      }else{
        this.assesmentService.createAssesment(asses).subscribe(
          success => {
            if(success.id){
              this.id = success.id;
              this.assesObj = success;
              this.isEditable = true;
              this.loading = false;
              this.isErrAsses = false;
              toastr.success(this.message.success);

            }
          },
          error => {
            this.error.text = error;
            this.isErrAsses = true;
            this.loading = false;
          }
        );
      }

    }
  }

  addAnswer(){

    var rand = Math.floor((Math.random() * 10000) + 1);
    var id = "tempDivId-"+rand;

    var html = '<div id="'+id+'" class="form-group m-form__group row align-items-center"  style="margin-left:-40px">'+
    '<div class="col-md-1"> '+
    '  <span class="m-switch m-switch--outline m-switch--icon m-switch--success"> '+
    '    <label> '+
    '      <input type="checkbox" name="" class="cbAnswer"> '+
    '      <span></span> '+
    '    </label> '+
    '  </span> '+
    '  <div class="d-md-none m--margin-bottom-10"></div> '+
    '</div> '+
    '<div class="col-md-10"> '+
    '  <div class="col-lg-12 col-md-12 col-sm-12"> '+
    '    <div class="m-form__control"> '+
    '      <input type="text" class="form-control m-input txtAnswer" placeholder="Sila Masukkan Jawapan"> '+
    '    </div> '+
    '  </div> '+
    '  <div class="d-md-none m--margin-bottom-10"></div> '+
    '</div> '+
    '<div class="col-md-1"> '+
    '  <a class="m--font-danger deleteQueFn" ><i class="la la-close"></i></a> '+
    '</div> '+
    '</div> ';

    var new_div = $(html).hide();
    $("#answerGrp").append(new_div);
    new_div.slideDown();

  }

  getFormAnswer(){

    let resultLs: any[] = new Array();
    let cbArr: any[] = new Array();
    let ansArr: any[] = new Array();

    var $cbAnswer = $(".cbAnswer");
    $cbAnswer.each( function(i) {
      cbArr.push($(this).is(":checked"));
     });

     var $txtAnswer = $(".txtAnswer");
     $txtAnswer.each( function(i) {
       ansArr.push($(this).val());
      });

    for(var i=0; i < ansArr.length; i++){
      let obj : AssesmentAnswer = new AssesmentAnswer(
        null,
        ansArr[i],
        cbArr[i]
      )
      resultLs.push(obj);
    }

    return resultLs;
  }

  onSubmitQue($event) {
    $event.preventDefault();

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(this.queId){

      let asses : AssesmentQuestion = new AssesmentQuestion(
        this.queId,
        this.assesForm.controls['question'].value,
        this.getFormAnswer(),
        this.assesObj
      );

      this.assesmentService.updateQue(asses).subscribe(
        success => {
          this.clearId();
          this.datatable.setDataSourceParam("id", this.id);
          this.datatable.reload();
          jQuery('#m_modal_add').modal('hide');
        },
        error => {
            this.clearId();
            console.log(error);
        },() => {
          this.clearId();
        }
      );

    }else{
      if (this.assesForm.valid) {

        let asses : AssesmentQuestion = new AssesmentQuestion(
          null,
          this.assesForm.controls['question'].value,
          this.getFormAnswer(),
          this.assesObj
        );

        this.assesmentService.createQue(asses).subscribe(
          success => {
            this.datatable.setDataSourceParam("id", this.id);
            this.datatable.reload();
            jQuery('#m_modal_add').modal('hide');
          }
        );
      }
    }

  }

  loadQueForm(answers){
    $("#answerGrp").empty();

    if(answers != null){
      for(let obj of answers){

        var answer = obj.answer;
        var checked = "";
        if(answer){
          checked = "checked='checked'"
        }

        var html = '<div id="'+obj.id+'" class="form-group m-form__group row align-items-center"  style="margin-left:-40px">'+
        '<div class="col-md-1"> '+
        '  <span class="m-switch m-switch--outline m-switch--icon m-switch--success"> '+
        '    <label> '+
        '      <input type="checkbox" '+checked+' name="" class="cbAnswer"> '+
        '      <span></span> '+
        '    </label> '+
        '  </span> '+
        '  <div class="d-md-none m--margin-bottom-10"></div> '+
        '</div> '+
        '<div class="col-md-10"> '+
        '  <div class="col-lg-12 col-md-12 col-sm-12"> '+
        '    <div class="m-form__control"> '+
        '      <input type="text" class="form-control m-input txtAnswer" placeholder="Sila Masukkan Jawapan" value="'+obj.option+'"> '+
        '    </div> '+
        '  </div> '+
        '  <div class="d-md-none m--margin-bottom-10"></div> '+
        '</div> '+
        '<div class="col-md-1"> '+
        '  <a class="m--font-danger deleteQueFn" ><i class="la la-close"></i></a> '+
        '</div> '+
        '</div> ';

        $("#answerGrp").append(html);
      }
    }
  }

  addNew($event){
    $event.preventDefault();
    $("#answerGrp").empty();
    this.assesForm.patchValue({
      question: ''
    });
    jQuery('#m_modal_add').modal('show');
  }

  redirectToList(){
    this.router.navigate(['/assesment/list']);
  }

  clearId(){
    this.queId = null;
  }
}
