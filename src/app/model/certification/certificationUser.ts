import { User } from '../../model/user';
import { Certification } from '../../model/certification/certification';
import { Filestorage } from '../../model/ref/filestorage';

export class CertificationUser {

  public user: User;
  public certification: Certification;
  //public coach_remarks: string;
  public admin_remarks: string;
  public status: string;
  public id: string;
  public createdBy: User;
  public evaluatedBy: User;
  public approvedBy: User;
  public statusResult: string;
  public remarks: string;
  public cert: Filestorage;

   constructor(
     user:User,
     certification:Certification,
     admin_remarks:string,
     status:string,
     id:string,
     createdBy: User,
     evaluatedBy: User,
     approvedBy: User,
     statusResult:string,
     remarks:string,
     cert: Filestorage

   ) {
     this.user = user;
     this.certification = certification;
     //this.coach_remarks = coach_remarks;
     this.admin_remarks = admin_remarks;
     this.status = status;
     this.id = id;
     this.createdBy = createdBy;
     this.evaluatedBy = evaluatedBy;
     this.approvedBy = approvedBy;
     this.statusResult = statusResult;
     this.remarks = remarks;
     this.cert = cert;

   }
}
