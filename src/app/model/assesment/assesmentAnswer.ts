export class AssesmentAnswer {

  public id: string;
  public option: string;
  public answer: boolean;

   constructor(id:string, option:string, answer:boolean) {
     this.id = id;
     this.option = option;
     this.answer = answer;
   }
}
