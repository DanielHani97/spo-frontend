export class MandayTransaction {

    public id: string;
    public type: string;
    public instanceId: string;
    public manday: number;
    public instanceDate: Date;


    constructor(type: string, instanceId: string, manday: number, id: string, instanceDate: Date) {

        this.type = type;
        this.instanceId = instanceId;
        this.manday = manday;
        this.id = id;
        this.instanceDate = instanceDate;

    }
}
