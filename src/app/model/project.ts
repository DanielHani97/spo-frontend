import { User } from '../model/user';
import { Agency } from '../model/setup/agency';
import { Technology } from '../model/setup/technology';


export class Project {

  public id: string;
  public name: string;
  public technology: Technology;
  public role: string;
  public description: string;
  public type: string;
  public starting_date: Date;
  public ending_date: Date;
  public agency: Agency;
  public user: User;


   constructor(id:string, name:string, technology:Technology, role:string, description:string, type:string, starting_date: Date,
   ending_date: Date, agency:Agency, user:User) {
     this.id = id;
     this.name = name;
     this.technology = technology;
     this.role = role;
     this.description = description;
     this.type = type;
     this.starting_date = starting_date;
     this.ending_date = ending_date;
     this.agency = agency;
     this.user = user;

   }
}
