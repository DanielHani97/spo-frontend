import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Agency } from '../../../../../model/setup/agency';
import { AgencyService } from '../../../../../services/setup/agency.service';
import { State } from '../../../../../model/ref/state';
import { City } from '../../../../../model/ref/city';
import { CountryService } from '../../../../../services/ref/country.service';
import { UserService } from '../../../../../services/user.service';

import { User } from '../../../../../model/user';
import { Company } from '../../../../../model/setup/company';
import { Grade } from '../../../../../model/setup/grade';
import { GradeService } from '../../../../../services/setup/grade.service';
import { Schema } from '../../../../../model/setup/schema';
import { SchemaService } from '../../../../../services/setup/schema.service';

import { environment } from "../../../../../../environments/environment";
import { message } from "../../../../../message/default";

declare let toastr:any;
declare let $:any;
@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./user-detail.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AgencyService, CountryService, UserService, GradeService, SchemaService]
})
export class UserDetailComponent implements OnInit, AfterViewInit{

    agency: Agency;
    id: string;

    profileForm: FormGroup;
    passForm: FormGroup;
    private sub: any;

    stateLs : any[];
    currentState: any;

    cities : any[];
    currentCity: any;
    city: City;
    state: State;

    ccurrentState: any;

    ccities : any[];
    ccurrentCity: any;
    ccity: City;
    cstate: State;

    grade : Grade;
    gradeLs : any[];
    currentGrade : any;

    schema : Schema;
    schemaLs : any[];
    currentSchema : any;

    isGov: boolean = true;

    agencyLs : any[];

    agencyUser: Agency;
    currentAgency : any;

    companyId: string;

    loading: boolean = false;

    constructor(
      private _script: ScriptLoaderService,
      private agencyService:AgencyService,
      private countryService:CountryService,
      private router:Router,
      private route: ActivatedRoute,
      private userService:UserService,
      private gradeService:GradeService,
      private schemaService:SchemaService
    ) { }

    ngOnInit() {

      this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      });

      this.profileForm = new FormGroup({
        name: new FormControl('', Validators.required),
        phoneNo: new FormControl(''),
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        position: new FormControl(''),
        grade: new FormControl(''),
        schema: new FormControl(''),
        address: new FormControl(''),
        state: new FormControl(),
        city: new FormControl(),
        postcode: new FormControl(''),
        type: new FormControl('1'),
        agency: new FormControl('', Validators.required),
        agencyPhoneNo: new FormControl({value: '', disabled: true}),
        agencyState: new FormControl({value: '', disabled: true}),
        agencyCity: new FormControl({value: '', disabled: true}),
        agencyAddress: new FormControl({value: '', disabled: true}),
        agencyPostcode: new FormControl({value: '', disabled: true}),
        cname: new FormControl('', Validators.required),
        cphoneNo: new FormControl('', Validators.required),
        cstate: new FormControl('', Validators.required),
        ccity: new FormControl('', Validators.required),
        caddress: new FormControl('', Validators.required),
        cpostcode: new FormControl('', Validators.required)

      });

      this.passForm = new FormGroup({
        password: new FormControl('')
      });

      //load states value
      this.countryService.getState().subscribe(
        data =>{
          this.stateLs = data;
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

      this.agencyService.getAgency().subscribe(
        data => {
          this.agencyLs = data;
      });

      //Load agency by id to edit
      if (this.id) { //edit form
        this.userService.getUserById(this.id).subscribe(
          user =>{

            var stateId = "0";
            var cityId = "0";

            var state = user.state;
            var city = user.city;
            var grade = user.grade;
            var schema = user.schema;

            var gradeId = "0";
            var schemaId = "0";

           if(state){
             stateId = user.state.id;

             //load city based on state
             this.countryService.getCity(stateId).subscribe(
               data => {
                 this.cities = data;
               }
             );
           }
           if(city){
             cityId = user.city.id;
           }

            if(grade){
              gradeId = user.grade.id;
            }
            if(schema){
              schemaId = user.schema.id;
            }

            var type = user.type;

            if(type === "GOV"){
              this.profileForm.get('type').setValue('1');
              this.isGov = true;
            }else{
              this.profileForm.get('type').setValue('0');
              this.isGov = false;
            }

            var agency = user.agency;
            var agencyId = "";
            var agencyPhoneNo =  "";
            var agencyState;
            var agencyCity;
            var agencyAddress =  "";
            var agencyPostcode;
            var agencyStateId = "";
            var agencyCityId = "";

            if(agency){
              agencyId = agency.id;
              agencyPhoneNo =  agency.phoneNo;
              agencyState =  agency.state;
              if(agencyState){
                agencyStateId = agencyState.id;
              }if(agencyCity){
                agencyCityId = agencyCity.id;
              }
              agencyAddress =  agency.address;
              agencyPostcode =  agency.postcode;
            }

            var company = user.company;
            var cname = "";
            var cPhoneNo =  "";
            var cStateId =  "";
            var cCityId =  "";
            var cAddress =  "";
            var cPostcode;

            if(company){
              this.companyId = company.id;
              cname = company.name;
              cPhoneNo =  company.phoneNo;
              var cState =  company.state;
              var cCity =  company.city;

              if(cState){
                cStateId = cState.id;

                //load city based on state
                this.countryService.getCity(cStateId).subscribe(
                  data => {
                    this.ccities = data;
                  }
                );
              }if(cCity){
                cCityId = cCity.id;
              }

              cAddress =  company.address;
              cPostcode =  company.postcode;
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
              state: stateId,
              city: cityId,
              postcode: user.postcode,
              agency: agencyId,
              agencyPhoneNo: agencyPhoneNo,
              agencyState: agencyStateId,
              agencyCity: agencyCityId,
              agencyAddress: agencyAddress,
              agencyPostcode: agencyPostcode,
              cname: cname,
              cphoneNo: cPhoneNo,
              cstate: cStateId,
              ccity: cCityId,
              caddress: cAddress,
              cpostcode: cPostcode,
            });
          }
        );
       }
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper');

         var form = $('#passForm');
         form.validate({
           rules:{
             password: {
               required : true,
               remote: {
                 url: environment.hostname+"/api/verify/password",
                 type: "post"
               }
             }
           }
         });

    }

    redirectUserPage() {
      this.router.navigate(['/user-management/list']);
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

    setGrade(gradeId: any): void{

        this.currentGrade = this.gradeLs.filter(value => value.id === gradeId)
        this.grade = this.currentGrade[0];

    }

    setSchema(schemaId: any): void{

        this.currentSchema = this.schemaLs.filter(value => value.id === schemaId)
        this.schema = this.currentSchema[0];

    }

    radTypeClick(){
      var type = this.profileForm.controls['type'].value;
      if(type === "0"){
        this.isGov = false;
      }else{
        this.isGov = true;
      }
    }

    setAgency(valueId: string): void{

        this.currentAgency = this.agencyLs.filter(value => value.id === valueId)
        this.agencyUser = this.currentAgency[0];

        //set all value
        this.agencyService.getAgencyById(valueId).subscribe(
            agency => {

                this.agency = agency;
                this.profileForm.patchValue({
                  agencyCode: agency.code,
                  agencyPhoneNo: agency.phoneNo,
                  agencyState: agency.state.name,
                  agencyCity: agency.city.name,
                  agencyAddress: agency.address,
                  agencyPostcode: agency.postcode
              });
             }
          );


    }

    submit($event){
      $event.preventDefault();

      this.loading = true;

      var form = $('#profileForm');

      var userType = "PRIVATE"

      if(this.isGov){
        userType = "GOV";
          form.validate({
            rules:{
              username: "required",
              name: "required",
              email: {
                required: true,
                email: true
              },
              agency: "required"
            }
          });

      }else{
        form.validate({
          rules:{
            username: "required",
            name: "required",
            cname: "required",
            cphoneNo: "required",
            caddress: "required",
            cstate: "required",
            ccity: "required",
            cpostcode: {
              required: true,
              digits: true,
              minlength: 5,
              maxlength: 5
            },
            email: {
              required: true,
              email: true
            }
          }
        });
      }

       if(!form.valid() && !this.profileForm.valid){
         this.loading = false;
         return false;
       }else{
         if (this.id){

           let company: Company = new Company(
             this.companyId,//public id: string;
             this.profileForm.controls['cname'].value,//public name: string;
             this.profileForm.controls['cphoneNo'].value,//public phoneNo: string;
             this.profileForm.controls['caddress'].value,//public address: string;
             this.ccity,//public city: City;
             this.cstate,//public state: State;
             this.profileForm.controls['cpostcode'].value//public postcode: number;
           )

           let user: User = new User(

           this.id,
           this.profileForm.controls['username'].value,
           this.profileForm.controls['name'].value,
           this.profileForm.controls['email'].value,
           null,//newPass
           null,//oldPass
           this.profileForm.controls['address'].value,
           this.profileForm.controls['position'].value,
           this.profileForm.controls['postcode'].value,
           this.profileForm.controls['phoneNo'].value,
           this.agencyUser,//agency
           null,
           null,
           null,
           this.state,
           this.city,
           this.grade,
           this.schema,
           null, //image
           userType,
           company//company
           );

           this.userService.updateUser(user).subscribe(
             sucess =>{
                this.loading = false;
                toastr.success(message.global.success);
               }
             );
         }
       }
    }

    submitPass($event){
      $event.preventDefault();

      this.loading = true;

      var form = $('#passForm');

       if(!form.valid()){
         this.loading = false;
         return false;
       }else{
         if (this.id){

           let user: User = new User(
           this.id,
           null,
           null,
           null,
           this.passForm.controls['password'].value,//newPass
           this.passForm.controls['password'].value,//oldPass
           null,
           null,
           null,
           null,
           null,//agency
           null,
           null,
           null,
           null,
           null,
           null,
           null,
           null, //image
           null,
           null//company
           );

           this.userService.updateUserSetting(user).subscribe(
             sucess =>{
                this.loading = false;
                toastr.success(message.global.success);
               }
             );
         }
       }
    }
}
