
export class Technology  {

  public name: string;
  public type: string;
  public language: string;
  public status: string;
  public created_by : string;
  public modified_by : string;
  public id: string;

   constructor(name:string, type:string, language:string, status:string, created_by: string, modified_by: string, id:string) {
     this.name = name;
     this.type = type;
     this.language = language;
     this.status = status;
     this.created_by = created_by;
     this.modified_by = modified_by;
     this.id = id;
   }
}
