export class Filestorage {

  public id: string;
  public content: any;
  public name: string;
  public type: string;
  public instanceid: string;

   constructor(id:string, content:any, name:string, type: string, instanceid: string) {
     this.id = id;
     this.content = content;
     this.name = name;
     this.type = type;
     this.instanceid = instanceid;
   }
}
