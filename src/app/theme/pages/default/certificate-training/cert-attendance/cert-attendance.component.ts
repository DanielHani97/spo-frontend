import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";

import { CertificationUser } from '../../../../../model/certification/certificationUser';
import { CertificationService } from '../../../../../services/certification/certification.service';
declare let toastr:any;

import { message } from "../../../../../message/default";

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./cert-attendance.component.html",
    encapsulation: ViewEncapsulation.None,
    providers: [CertificationService]
})

export class CertAttendanceComponent implements OnInit, AfterViewInit, OnDestroy {

    certForm: FormGroup;
    id: string;
    attendLs: any[];
    currentAttend: any;
    userid : string;
    instanceid : string;
    loading: boolean = false;
    isEditable = false;

    message: any = {
          success: "Kehadiran telah berjaya disimpan"
        }

    userObj = null;
    certObj = null;
    admin: any;
    sts: any;
    create: any;
    ev: any;
    apprv: any;

    private sub: any;

    //document upload
    @ViewChild('fileCert') fileCert;
    certName: String;
    certId: string;
    filestorage: any;

    constructor(private _script: ScriptLoaderService, private certificationService:CertificationService,private router:Router, private route: ActivatedRoute) { }

    ngOnInit() {

        this.certForm = new FormGroup({
            name: new FormControl({value: '', disabled: true}, Validators.required),
            title: new FormControl({value: '', disabled: true}, Validators.required),
            statusResult: new FormControl('', Validators.required),
            remarks: new FormControl(),
            cert: new FormControl()
       });

        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.certificationService.getCertificationUserById(this.id).subscribe(

                data => {

                  this.certForm.patchValue({
                      name: data.user.name,
                      title: data.certification.title,
                      statusResult: data.statusResult,
                      remarks: data.remarks,
                      cert: data.cert,
                  })

                  this.userObj = data.user;
                  this.certObj = data.certification;
                  this.admin = data.admin_remarks;
                  this.sts = data.status;
                  this.create = data.createdBy;
                  this.ev = data.evaluatedBy;
                  this.apprv = data.approvedBy;

                  //fileupload
                  var file = data.cert;
                  if(file){
                    this.filestorage = file;
                    this.certName = file.name;
                  }
                },

            error => {
              console.log(error);
            }
          );
      });
     }


    ngOnDestroy(): void{
           this.sub.unsubscribe();
    }

    redirectListPage() {
      this.router.navigate(['/cert/list']);
    }

    ngAfterViewInit() {

      this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
             'assets/osdec/validation/certification/certAttend-val.js', 'assets/osdec/validation/validation.js');
    }

    onSubmit(){

      if (this.certForm.valid) {

            if (this.id) {
               this.isEditable = true;

               let data: CertificationUser = new CertificationUser (
                    this.userObj,
                    this.certObj,
                    this.admin,
                    this.sts,
                    this.id,
                    this.create,
                    this.ev,
                    this.apprv,
                    this.certForm.controls['statusResult'].value,
                    this.certForm.controls['remarks'].value,
                    null
                    );

                let input = new FormData();

                input.append('fileCert', this.certForm.get('cert').value);
                input.append('info', new Blob([JSON.stringify(data)],
                    {
                        type: "application/json"
                    }));

                const formModel = input;

                this.certificationService.updateCertificationUserFile(formModel).subscribe(

                  success => {
                     this.redirectListPage();
                     this.isEditable = true;
                     this.loading = false;
                     toastr.success(this.message.success);
                  }

                );

               }

        }

    }

    fileChange(e) {
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = "application/pdf";
        var reader = new FileReader();

        if (file.type != pattern) {
            toastr.error(message.global.invalidFormatPdf);
            return;
        }else{
          this.certName = file.name;
          reader.readAsDataURL(file);
          this.certForm.get('cert').setValue(file);
        }
    }

    downloadCertificate(storageObj){
      var data = this.base64ToArrayBuffer(storageObj.content);

      var blob = new Blob([data]);
      var url= window.URL.createObjectURL(blob);
      window.open(url);
    }

    base64ToArrayBuffer(base64) {
      var binaryString = window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++) {
         var ascii = binaryString.charCodeAt(i);
         bytes[i] = ascii;
      }
      return bytes;
   }
}
