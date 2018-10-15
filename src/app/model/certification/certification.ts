import { Technology } from '../../model/setup/technology';
import { User } from '../../model/user';

export class Certification {

  public title: string;
  public technology: Technology;
  public user: User;
  //public duration: string;
  public startDate: Date;
  public endDate: Date;
  public place: string;
  public level: string;
  public status: string;
  public remark: string;
  public id: string;
  public image: any;
  public created_by: string;
  public modified_by: string;
  public limitation: string;

  constructor(
     title:string,
     technology:Technology,
     user:User,
     //duration:string,
     startDate:Date,
     endDate:Date,
     place:string,
     level:string,
     status:string,
     remark:string,
     id:string,
     image:any,
     created_by:string,
     modified_by:string,
     limitation: string
   )

   {

     this.title = title;
     this.technology = technology;
     this.user = user;
     //this.duration = duration;
     this.startDate = startDate;
     this.endDate = endDate;
     this.place = place;
     this.level = level;
     this.status = status;
     this.remark = remark;
     this.id = id;
     this.image = image;
     this.created_by = created_by;
     this.modified_by = modified_by;
     this.limitation = limitation;

   }
}
