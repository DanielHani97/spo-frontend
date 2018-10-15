import { UserAssesmentAnswer } from "./userAssesmentAnswer";
import { UserAssesment } from "./userAssesment";

export class UserAssesmentQuestion {

  public id: string;
  public question: string;
  public userAssesmentAnswer: UserAssesmentAnswer[];
  public userAssesment: UserAssesment;
  public answer: string;

   constructor(id:string, question:string, userAssesmentAnswer:UserAssesmentAnswer[], userAssesment: UserAssesment, answer: string) {
     this.id = id;
     this.question = question;
     this.userAssesmentAnswer = userAssesmentAnswer;
     this.userAssesment = userAssesment;
     this.answer = answer;
   }
}
