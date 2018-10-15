import { FeedbackSectionQuestion } from "./feedbackSectionQuestion";

export class FeedbackSection {

  public id: string;
  public title: string;
  public feedbackSectionQuestion: FeedbackSectionQuestion[];

   constructor(id:string, title:string, feedbackSectionQuestion:FeedbackSectionQuestion[]) {
     this.id = id;
     this.title = title;
     this.feedbackSectionQuestion = feedbackSectionQuestion;
   }
}
