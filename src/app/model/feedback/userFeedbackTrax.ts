import { User } from '../../model/user';

export class UserFeedbackTrax {

  public id: string;
  public parentid: string;
  public instanceid: string;
  public feedbackname: string;
  public marks: number;
  public title: string;
  public type: string;
  public user: User;
  public createdby: User;

   constructor(
     id: string,
     parentid: string,
     instanceid: string,
     feedbackname: string,
     marks: number,
     title: string,
     type: string,
     user: User,
     createdby: User
   ) {
     this.id = id;
     this.parentid = parentid;
     this.instanceid = instanceid;
     this.feedbackname = feedbackname;
     this.marks = marks;
     this.title = title;
     this.type = type;
     this.user = user;
     this.createdby = createdby;
   }
}
