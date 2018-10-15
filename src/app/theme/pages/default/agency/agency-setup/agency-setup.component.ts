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

@Component({
    selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
    templateUrl: "./agency-setup.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [AgencyService, CountryService]
})
export class AgencySetupComponent implements OnInit, AfterViewInit, OnDestroy {

    agency: Agency;
    id: string;

    agencyForm: FormGroup;
    private sub: any;

    stateLs : any[];
    currentState: any;

    cities : any[];
    currentCity: any;
    city: City;
    state: State;

    constructor(
      private _script: ScriptLoaderService,
      private agencyService:AgencyService,
      private countryService:CountryService,
      private router:Router,
      private route: ActivatedRoute
    ) { }

    ngOnInit() {

      this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      });

      //load states value
      this.countryService.getState().subscribe(
        data =>{
          this.stateLs = data;
        }
      );

      this.agencyForm = new FormGroup({
        name: new FormControl('', Validators.required),
        code: new FormControl('', Validators.required),
        phoneNo: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        address: new FormControl('', Validators.required),
        postcode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
      });
    }

    ngOnDestroy(): void{
       this.sub.unsubscribe();
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/setup/agency-val.js');

             //Load agency by id to edit
             if (this.id) { //edit form
                this.agencyService.getAgencyById(this.id).subscribe(
                  agency => {
                      this.id = agency.id;

                      var state =  agency.state;
                      var city =  agency.city;
                      var stateid = "";
                      var cityid = "";

                      if(state){
                        stateid = state.id;

                        //load city based on state
                        this.countryService.getCity(stateid).subscribe(
                          data => {
                            this.cities = data;
                          }
                        );
                      }if(city){
                        cityid = city.id;
                      }

                      this.agencyForm.patchValue({
                      name: agency.name,
                      code: agency.code,
                      phoneNo: agency.phoneNo,
                      state: stateid,
                      city: cityid,
                      address: agency.address,
                      postcode: agency.postcode
                    });

                    if(stateid){
                      this.currentState = this.stateLs.filter(value => parseInt(value.id) === parseInt(stateid));
                      this.state = this.currentState[0];
                    }if(cityid){
                      this.currentCity = this.cities.filter(value => parseInt(value.id) === parseInt(cityid));
                      this.city = this.currentCity[0];
                    }
                   },error => {
                    console.log(error);
                   }
                );
              }

    }

    onSubmit() {
      if (this.agencyForm.valid) {
          if (this.id){
            let agency: Agency = new Agency(
            this.agencyForm.controls['name'].value,
            this.agencyForm.controls['code'].value,
            this.agencyForm.controls['phoneNo'].value,
            this.agencyForm.controls['address'].value,
            this.city,
            this.state,
            this.agencyForm.controls['postcode'].value,
            this.id);

            this.agencyService.updateAgency(agency).subscribe(
              success => {
                this.redirectAgencyPage();
              }
            );

          }else{

            let agency: Agency = new Agency(
            this.agencyForm.controls['name'].value,
            this.agencyForm.controls['code'].value,
            this.agencyForm.controls['phoneNo'].value,
            this.agencyForm.controls['address'].value,
            this.city,
            this.state,
            this.agencyForm.controls['postcode'].value,
            null);

            this.agencyService.createAgencies(agency).subscribe(
              success => {
                this.redirectAgencyPage();
              }
            );
          }
       }
    }

    redirectAgencyPage() {
      this.router.navigate(['/agency/list']);
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
}
