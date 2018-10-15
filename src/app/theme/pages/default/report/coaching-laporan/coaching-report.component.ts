import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy} from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Coaching } from '../../../../../model/coaching/coaching';
import { CoachingService } from '../../../../../services/coaching/coaching.service'

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./coaching-report.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CoachingService]
})
export class CoachingReportComponent implements OnInit, AfterViewInit, OnDestroy  {

	coaching: Coaching;
	id: string;
  currentUser: any;
  bearToken : string;

  coachingName: string;
  startDate: string;
  endDate: string;
  coachList: string;
  tableHeader: any[];


	private sub: any;

    constructor(
      private _script: ScriptLoaderService,
      private coachingService:CoachingService,
      private router:Router,
      private route: ActivatedRoute
    ) { }

    ngOnInit() {

      this.bearToken = "Bearer "+localStorage.getItem('jwtToken');
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.currentUser = currentUser;

      this.sub = this.route.params.subscribe(
        params => {
          this.id = params['id'];

          this.coachingService.getCoachingById(this.id).subscribe(
            data =>{
              this.coachingName = data.name;
              this.startDate = this.formatDate(data.starting_date);
              this.endDate = this.formatDate(data.ending_date);            
            }
          )

          this.coachingService.getCoachingCoach(this.id).subscribe(
            data=>{
              var str = "";
              for (var i = 0; i < data.length; ++i) {
                str = str + data[i].coach.name + ", "
              }
              str = str.substring(0, str.length - 2);
              this.coachList = str;
            }
          )

          this.coachingService.getActivitiReport(this.id).subscribe(
            data=>{
              this.tableHeader = data;
            }
          )
        }
      );
    }

    

    formatDate(date){
        var datemagic = new Date(date);
        var day = datemagic.getDate();
        var month = datemagic.getMonth()+1;
        var year = datemagic.getFullYear();
        return day + '/' + month + '/' + year;
    }


    ngOnDestroy(): void{
    	this.sub.unsubscribe();
    }

    ngAfterViewInit() {
    	this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper');
    }

    redirectListPage(){
        window.history.back();
    }

    onSubmit(){
    	
    }

    redirectProfile(id){
      this.router.navigate(['/header/profile/view/', id]);
    }
}
