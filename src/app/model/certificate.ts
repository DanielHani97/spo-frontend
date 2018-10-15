import { User } from '../model/user';
import { Filestorage } from '../model/ref/filestorage';

export class Certificate {

  public id: string;
  public name: string;
  public category: string;
  public filestorage: Filestorage;
  public user: User;

   constructor( id:string, name:string, category:string, filestorage: Filestorage, user: User ) {
     this.id = id;
     this.name = name;
     this.category = category;
     this.filestorage = filestorage;
     this.user = user;
   }
}
