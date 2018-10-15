import { AssesmentAnswer } from "./assesmentAnswer";
import { Assesment } from "./assesment";

export class AssesmentQuestion {

  public id: string;
  public question: string;
  public assesmentAnswer: AssesmentAnswer[];
  public assesment: Assesment;

   constructor(id:string, question:string, assesmentAnswer:AssesmentAnswer[], assesment: Assesment) {
     this.id = id;
     this.question = question;
     this.assesmentAnswer = assesmentAnswer;
     this.assesment = assesment;
   }
}
