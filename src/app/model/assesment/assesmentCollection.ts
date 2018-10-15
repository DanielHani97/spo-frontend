import { Assesment } from "./assesment";
import { UserAssesmentTrax } from "./userAssesmentTrax";

export class AssesmentCollection {

  public assesment: Assesment;
  public userAssesmentTrax: UserAssesmentTrax[];

   constructor(assesment: Assesment, userAssesmentTrax: UserAssesmentTrax[]) {
     this.assesment = assesment;
     this.userAssesmentTrax = userAssesmentTrax;
   }
}
