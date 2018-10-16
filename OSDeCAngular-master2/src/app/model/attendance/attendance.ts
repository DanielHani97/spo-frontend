import { User } from '../../model/user';

export class Attendance {

    public user: User;
    public status: string;
    public remarks: string;
    public instanceId: string;
    public category: string;
    public date: Date;
    public id: string;

    constructor(user: User, status: string, remarks: string, instanceId: string, category: string, date: Date, id: string) {
        this.user = user;
        this.status = status;
        this.remarks = remarks;
        this.instanceId = instanceId;
        this.category = category;
        this.date = date;
        this.id = id;

    }
}
