import { User } from '../../model/user';
import { UserAssesmentQuestion } from './userAssesmentQuestion';
import { Technology } from '../../model/setup/technology';

export class UserAssesment {

  public id: string;
  public level: string;
  public category: string;
  public technology: Technology;
  public userAssesmentQuestion: UserAssesmentQuestion[];
  public questionno: number;
  public userId: string;
  public user: User;

   constructor(
     id: string,
     level: string,
     category: string,
     technology: Technology,
     userAssesmentQuestion: UserAssesmentQuestion[],
     questionno: number,
     userId: string,
     user: User,
   ) {
     this.id = id;
     this.level = level;
     this.category = category;
     this.technology = technology;
     this.userAssesmentQuestion = userAssesmentQuestion;
     this.questionno = questionno;
     this.userId = userId;
     this.user = user;
   }
}
