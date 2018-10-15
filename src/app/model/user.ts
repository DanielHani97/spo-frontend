import { Agency } from '../model/setup/agency';
import { Project } from '../model/project';
import { Skill } from '../model/skill';
import { Certificate } from '../model/certificate';
import { State } from '../model/ref/state';
import { City } from '../model/ref/city';
import { Grade } from '../model/setup/grade';
import { Schema } from '../model/setup/schema';
import { Company } from '../model/setup/company';

export class User {

  public id: string;
  public username: string;
  public name: string;
  public email: string;
  public new_password: string;
  public old_password: string;
  public address: string;
  public position: string;
  public postcode: number;
  public phoneNo: string;

  public agency: Agency;
  public project: Project;
  public skill: Skill[];
  public certificate: Certificate;
  public state: State;
  public city: City;
  public grade: Grade;
  public schema: Schema;
  public image: any;
  public type: string;
  public company: Company;

   constructor(id:string, username:string, name:string, email:string, new_password:string, old_password:string, address:string, position:string,  postcode:number,  phoneNo:string,
     agency:Agency, project:Project, skill:Skill[], certificate:Certificate, state:State, city:City, grade:Grade, schema:Schema, image: any,type: string,company: Company) {

     this.id = id;
     this.username = username;
     this.name = name;
     this.email = email;
     this.new_password = new_password;
     this.old_password = old_password;
     this.address = address;
     this.position = position;
     this.postcode = postcode;
     this.phoneNo = phoneNo;
     this.agency = agency;
     this.project = project;
     this.skill = skill;
     this.certificate = certificate;
     this.state = state;
     this.city = city;
     this.grade = grade;
     this.schema = schema;
     this.image = image;
     this.type = type;
     this.company = company;
   }
}
