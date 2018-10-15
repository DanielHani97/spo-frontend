import { Feedback } from "./feedback";
import { FeedbackSection } from "./feedbackSection";
import { FeedbackSectionQuestion } from "./feedbackSectionQuestion";
import { User } from '../../model/user';

export class FeedbackCollection {

  public feedback: Feedback;
  public feedbackSection: FeedbackSection[];
  public feedbackSectionQuestion: FeedbackSectionQuestion[];
  public createdby: User;
  public user: User;
  public type: string;

   constructor(
     feedback: Feedback,
     feedbackSection: FeedbackSection[],
     feedbackSectionQuestion: FeedbackSectionQuestion[],
     createdby: User,
     user: User,
     type: string
   ) {
     this.feedback = feedback;
     this.feedbackSection = feedbackSection;
     this.feedbackSectionQuestion = feedbackSectionQuestion;
     this.createdby = createdby;
     this.user = user;
     this.type = type;
   }
}
