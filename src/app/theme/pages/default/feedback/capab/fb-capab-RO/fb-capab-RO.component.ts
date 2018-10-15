import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy} from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { User } from '../../../../../../model/user';

import { Feedback } from '../../../../../../model/feedback/feedback';
import { FeedbackSectionQuestion } from '../../../../../../model/feedback/feedbackSectionQuestion';
import { FeedbackService } from '../../../../../../services/feedback/feedback.service'
import { CapabilityService } from '../../../../../../services/capability/capability.service'

import { FeedbackCollection } from '../../../../../../model/feedback/feedbackCollection';
import { UserFeedbackSectionQuestion } from '../../../../../../model/feedback/userFeedbackSectionQuestion';
import { UserFeedbackTrax } from '../../../../../../model/feedback/userFeedbackTrax';

import { message } from "../../../../../../message/default";

declare let toastr : any;
declare let jQuery:any;
@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./fb-capab-RO.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [ FeedbackService, CapabilityService]
})
export class FBCapabROComponent implements OnInit, AfterViewInit, OnDestroy  {

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
  role: string;

    constructor(
      private _script: ScriptLoaderService,
      private feedbackService:FeedbackService,
      private capabilityService: CapabilityService,
      private router:Router,
      private route: ActivatedRoute,
      private location: Location) { }

    ngOnInit() {
      this.sub = this.route.params.subscribe(
    		params => {
          this.userid = params['userid'];
          this.instanceid = params['instanceid'];
        }
      );

      this.user = JSON.parse(localStorage.getItem('currentUser'));
      this.id = localStorage.getItem("PARENTID");
    }

    ngOnDestroy(): void{
    	this.sub.unsubscribe();
    }

    ngAfterViewInit() {

      if(this.id){
        this.capabilityService.getCapabilityRole(this.id, this.user.id).subscribe(
          success =>{
            this.role = success;
          }
        )
      }

      if(this.instanceid){

        let userObj = new User(
          this.userid,
          null,null,null,null,null,null,null,null,null,null,
          null,null,null,null,null,null,null,null,null,null
        )

        let obj = new UserFeedbackTrax(
          null,//id: string,
          this.instanceid,//parentid: string,
          null,//instanceid: string,
          null,//feedbackname: string,
          null,//marks: number,
          null,//title: string,
          "CAPABILITY",//type: string,
          userObj,//user: User,
          null,//createdby: User
        )

        this.feedbackService.getFeedbackTrax(obj).subscribe(
          success =>{

            this.sectionLs = success.userFeedbackSection;

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
              for(let question of section.userFeedbackSectionQuestion){
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

    redirectToList(){
      this.location.back();
    }

    redirectAttend(){
      if(this.role == "ROLE_USER"){
        this.router.navigate(['/cap/attendance', this.id]);
      }else if(this.role == "ROLE_COACH"){
        this.router.navigate(['/cap/coachAttendance', this.id]);
      }
    }

    redirectInfo(){
      this.router.navigate(['/coaching/info', this.id]);
    }


}
