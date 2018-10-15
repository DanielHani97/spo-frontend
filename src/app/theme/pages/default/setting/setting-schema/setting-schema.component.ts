import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { Schema } from '../../../../../model/setup/schema';
import { SchemaService } from '../../../../../services/setup/schema.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./setting-schema.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [SchemaService]

})
export class SettingSchemaComponent implements OnInit, AfterViewInit, OnDestroy {

	schema: Schema;
  id: string;

  status : any;

  schemaCn: any[];

  private sub:any;

	schemaForm: FormGroup;

    constructor(private _script: ScriptLoaderService, private schemaService:SchemaService, private router:Router, private route: ActivatedRoute) {

    }
    ngOnInit() {

      this.schemaService.getSchemaCn().subscribe(
        data =>{
          this.schemaCn = data;
        }
        )

     this.sub = this.route.params.subscribe(params =>{
       this.id = params['id'];
     });
    	this.schemaForm = new FormGroup({
        name: new FormControl('', Validators.required),
        seniority: new FormControl('', Validators.required),
        status: new FormControl('', Validators.required),

      });

      // Load schema by id to edit
      if(this.id){
        this.schemaService.getSchemaById(this.id).subscribe(
          schema => {
            this.id = schema.id;
            this.schemaForm.patchValue({
              name: schema.name,
              seniority: schema.seniority,
              status: schema.status

          });

      },error =>{
       console.log(error);
         }
      );
    }
   }

    ngOnDestroy(): void{
    }

    ngAfterViewInit() {
         this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
                           'assets/osdec/validation/setup/schema-val.js',
                           'assets/demo/default/custom/components/forms/widgets/bootstrap-switch.js');


    }

    onSubmit() {
      if (this.schemaForm.valid) {
        if(this.id){


          let schema: Schema = new Schema(
          this.schemaForm.controls['name'].value,
          this.schemaForm.controls['seniority'].value,
          this.schemaForm.controls['status'].value,
          this.id
          );

          this.schemaService.updateSchema(schema).subscribe(
            success =>{
              this.redirectSchemaPage();
            });


       }else{
        console.log(this.schemaForm.controls);
         let schema:Schema = new Schema(
           this.schemaForm.controls['name'].value,
            this.schemaForm.controls['seniority'].value,
            this.schemaForm.controls['status'].value,
            null);

         this.schemaService.createSchemas(schema).subscribe(
           success => {
             this.redirectSchemaPage();
           } );


       }

           localStorage.setItem('RELOAD','YES');


       }

    }

    redirectSchemaPage() {
          this.router.navigate(['/schema-list/list']);
    }

    myStatus(id: any): void {

      this.status = id.value;

    }
}
