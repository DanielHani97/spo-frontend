import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy} from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../../model/user';
import { TrainingTx } from '../../../../../../model/training/trainingTx';

import { Feedback } from '../../../../../../model/feedback/feedback';
import { FeedbackSectionQuestion } from '../../../../../../model/feedback/feedbackSectionQuestion';
import { FeedbackService } from '../../../../../../services/feedback/feedback.service'

import { FeedbackCollection } from '../../../../../../model/feedback/feedbackCollection';
import { UserFeedbackSectionQuestion } from '../../../../../../model/feedback/userFeedbackSectionQuestion';

import { message } from "../../../../../../message/default";

declare let toastr : any;
declare let jQuery:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./fb-training-action.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [ FeedbackService]
})
export class FBTrainingActionComponent implements OnInit, AfterViewInit, OnDestroy  {

  loading: boolean = false;
	id: string;
	private sub: any;

  userid: string;
  instanceid: string;

  feedback: Feedback;
  sectionLs: any[];
  user: any;

  typeLbl: string;
  title: string;
  objective: string;
  mode: string;

    constructor(
      private _script: ScriptLoaderService,
      private feedbackService:FeedbackService,
      private router:Router,
      private route: ActivatedRoute,
      private location: Location) { }

    ngOnInit() {

      this.user = JSON.parse(localStorage.getItem('currentUser'));
      this.mode = localStorage.getItem("MODE");


      this.sub = this.route.params.subscribe(
    		params => {
          this.userid = params['userid'];
          this.id = params['instanceid'];
        }
      );

    }

    ngOnDestroy(): void{
    	this.sub.unsubscribe();
    }

    ngAfterViewInit() {

      if(this.userid && this.id && this.mode){

        let obj = new TrainingTx(
          null,null,null,null,null,
          this.mode,
          this.userid,
          this.id,
          null,null,null
        )

        this.feedbackService.getTrainingFb(obj).subscribe(
          success => {
            this.feedback = success;
            this.sectionLs = success.feedbackSection;

            this.title = success.title;
            this.objective = success.objective;

            var type = success.type;
            if(type == "PK"){
              this.typeLbl = "Penilaian Kursus";
            }else if(type == "PKK"){
              this.typeLbl = "Penilaian Keberkesanan Kursus";
            }else if(type == "PC"){
              this.typeLbl = "Penilaian Penceramah";
            }else if(type == "PBCP"){
              this.typeLbl = "Penilaian Berkala Coach Terhadap Peserta";
            }else if(type == "PBPC"){
              this.typeLbl = "Penilaian Berkala Peserta Terhadap Coach";
            }

            for(let section of this.sectionLs){
              for(let question of section.feedbackSectionQuestion){
                question.scale = this.getScale(question.min, question.max);
              }
            }
          }
        );
      }
    }

    getScale(min: number, max: number){
      var arr = [];
      for(var i=min; i<max+1; i++){
        arr.push(i);
      }
      return arr;
    }

    //set value for answer
    radClick(value, id){
      $(".hdScale").each( function(i) {
        var name = $(this).attr("name");
        if(name == id){
          $(this).val(value);
        }
      });
    }

    //set value for answer
    onKey(event: any, id){
      var value = event.target.value;
      $(".hdRemark").each( function(i) {
        var name = $(this).attr("name");
        if(name == id){
          $(this).val(value);
        }
      });
    }

    onSubmit(){

      this.loading = true;

      let arrId: any[] = new Array();
      let arrRadio: any[] = new Array();
      let arrRemarks: any[] = new Array();
      let arrRs: any[] = new Array();

      $(".hdQuestionId").each( function(i) {
        arrId.push($(this).val());
      });
      $(".hdRemark").each( function(i) {
        arrRemarks.push($(this).val());
      });
      $(".hdScale").each( function(i) {
        arrRadio.push($(this).val());
      });

      for(var i=0; i<arrId.length; i++){
        let obj = new FeedbackSectionQuestion(
          arrId[i],//id: string,
          null,//title: string,//temporary for trainingTxId
          this.id,//type: string,//temporary for traiingId
          null,//min: number,
          arrRadio[i],//max: number,//temporary for answer
          null,//minlbl: string,
          null,//maxlbl: string,
          arrRemarks[i],//detail: string,
          null,//user: User,
          null,//scale: any[]
        )

        arrRs.push(obj);


      }

      let userObj = new User(
        this.userid,
        null,null,null,null,null,null,null,null,null,null,
        null,null,null,null,null,null,null,null,null,null
      )

      let collObj = new FeedbackCollection(
        this.feedback,
        null,
        arrRs,
        this.user,//createdby
        userObj,//user
        "TRAINING"
      )

      this.feedbackService.createUserFb(collObj).subscribe(
        success => {
          toastr.success(message.global.success);
          this.router.navigate(['/training/feedback', this.id]);
        },
        error =>{
          console.log(error)
        },
        () => {
          this.loading = true;
        }
      );
    }

    redirectToList(){
      this.location.back();
    }

    redirectAttend(){
      this.router.navigate(['/training/current/attendance', this.id]);
    }

    redirectInfo(){
      this.router.navigate(['/training/info', this.id]);
    }


}
