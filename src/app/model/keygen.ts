export class Keygen {

  public id: string;
  public instanceId: string;
  public keygen: string;
  public createdDate: Date;
  public expiredDate: Date;

  constructor(
    id:string,
    instanceId:string,
    keygen:string,
    createdDate:Date,
    expiredDate:Date
    ) {

    this.id = id;
    this.instanceId = instanceId;
    this.keygen = keygen;
    this.createdDate = createdDate;
    this.expiredDate = expiredDate;
  }
}
