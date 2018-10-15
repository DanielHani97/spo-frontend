import { UserFeedbackSectionQuestion } from "./userFeedbackSectionQuestion";

export class UserFeedbackSection {

  public id: string;
  public title: string;
  public userFeedbackSectionQuestion: UserFeedbackSectionQuestion[];

   constructor(id:string, title:string, userFeedbackSectionQuestion:UserFeedbackSectionQuestion[]) {
     this.id = id;
     this.title = title;
     this.userFeedbackSectionQuestion = userFeedbackSectionQuestion;
   }
}
