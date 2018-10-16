import { Technology } from '../../model/setup/technology';

export class Capability {

    public name: string;
    public kepakaran: Technology;
    public status: string;
    public remarks: string;
    public duration: string;
    public limitation: string;
    public limitation_used: string;
    public starting_date: Date;
    public ending_date: Date;
    public created_by: string;
    public modified_by: string;
    public id: string;

    constructor(
        name: string,
        kepakaran: Technology,
        status: string,
        remarks: string,
        duration: string,
        limitation: string,
        limitation_used: string,
        starting_date: Date,
        ending_date: Date,
        created_by: string,
        modified_by: string,
        id: string) {

        this.name = name;
        this.kepakaran = kepakaran;
        this.status = status;
        this.remarks = remarks;
        this.duration = duration;
        this.limitation = limitation;
        this.limitation_used = limitation_used;
        this.starting_date = starting_date;
        this.ending_date = ending_date;
        this.created_by = created_by;
        this.modified_by = modified_by;
        this.id = id;

    }
}
