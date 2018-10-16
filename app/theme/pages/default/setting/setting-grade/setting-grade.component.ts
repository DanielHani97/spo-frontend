import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";


import { Grade } from '../../../../../model/setup/grade';
import { GradeService } from '../../../../../services/setup/grade.service';

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./setting-grade.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [GradeService]

})
export class SettingGradeComponent implements OnInit, AfterViewInit, OnDestroy {

    grade: Grade;
    id: string;

    gradeCn: any[];
    currentGrade: any;

    private sub: any;

    gradeForm: FormGroup;



    constructor(private _script: ScriptLoaderService, private gradeService: GradeService, private router: Router, private route: ActivatedRoute) {

    }
    ngOnInit() {

        this.gradeService.getGradeCn().subscribe(
            data => {
                this.gradeCn = data;
            }
        );

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];

        });

        this.gradeForm = new FormGroup({
            name: new FormControl('', Validators.required),
            seniority: new FormControl('', Validators.required),
            status: new FormControl(),

        });

        //load grade by id to edit
        if (this.id) {
            this.gradeService.getGradeById(this.id).subscribe(
                grade => {
                    this.id = grade.id;
                    this.gradeForm.patchValue({
                        name: grade.name,
                        seniority: grade.seniority,
                        status: grade.status

                    });

                }, error => {
                    console.log(error);
                }
            );
        }
    }


    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/osdec/validation/setup/grade-val.js');

    }

    onSubmit() {
        if (this.gradeForm.valid) {
            if (this.id) {

                let grade: Grade = new Grade(
                    this.gradeForm.controls['name'].value,
                    this.gradeForm.controls['seniority'].value,
                    this.gradeForm.controls['status'].value,
                    this.id);

                this.gradeService.updateGrade(grade).subscribe(
                    success => {
                        this.redirectGradePage();
                    });


            } else {

                let grade: Grade = new Grade(
                    this.gradeForm.controls['name'].value,
                    this.gradeForm.controls['seniority'].value,
                    this.gradeForm.controls['status'].value,
                    null
                );


                this.gradeService.createGrades(grade).subscribe(
                    success => {
                        this.redirectGradePage();
                    });
            }

            localStorage.setItem('RELOAD', 'YES');

        }


    }

    /*setGradeCn(valueId: string): void{
      this.currentGrade = this.gradeCn.filter(value => value.id === valueId)
      this.grade = this.currentGrade[0];

       if(this.id){
        this.gradeService.getGradeCn().subscribe(
         grade =>{
          this.id = grade.id;
          

      },error => {
             console.log(error);
            }
      );

       
    }
    }*/


    redirectGradePage() {
        this.router.navigate(['/grade-list/list']);
    }
}