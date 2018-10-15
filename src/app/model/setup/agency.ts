import {City} from '../../model/ref/city';
import {State} from '../../model/ref/state';

export class Agency {

  public name: string;
  public code: string;
  public phoneNo: string;
  public address: string;
  public city: City;
  public state: State;
  public postcode: number;
  public id: string;

   constructor(name:string, code:string, phoneNo:string, address:string, city:City, state:State, postcode:number, id:string) {
     this.name = name;
     this.code = code;
     this.phoneNo = phoneNo;
     this.address = address;
     this.city = city;
     this.state = state;
     this.postcode = postcode;
     this.id = id;
   }
}
