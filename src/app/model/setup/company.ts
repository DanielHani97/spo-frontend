import {City} from '../../model/ref/city';
import {State} from '../../model/ref/state';

export class Company {

  public id: string;
  public name: string;
  public phoneNo: string;
  public address: string;
  public city: City;
  public state: State;
  public postcode: number;


   constructor(id:string, name:string, phoneNo:string, address:string, city:City, state:State, postcode:number) {
     this.id = id;
     this.name = name;
     this.phoneNo = phoneNo;
     this.address = address;
     this.city = city;
     this.state = state;
     this.postcode = postcode;

   }
}
