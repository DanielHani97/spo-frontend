import { User } from '../../model/user';
import { CertificationUser } from '../../model/certification/certificationUser';

export class CurrentAttendance {

    public user: User;
    public cert: CertificationUser;
    public status: string;
    public remarks: string;
    public category: string;
    public date: Date;
    //public image: string;
    public instanceId: string;
    public id: string;

    constructor(user: User, cert: CertificationUser, status: string, remarks: string, category: string, date: Date, instanceId: string, id: string) {
        this.user = user;
        this.user = user;
        this.status = status;
        this.remarks = remarks;
        this.category = category;
        this.date = date;
        this.instanceId = instanceId;
        this.id = id;

    }
}
