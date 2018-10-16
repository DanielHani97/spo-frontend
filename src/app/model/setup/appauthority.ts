import { User } from '../user'

export class AppAuthority {

    public id: string;
    public remarks: string;
    public status: string;
    public createdby: User;
    public modifiedby: User;
    public createdon: Date;
    public modifiedon: Date;
    public roleid: string;
    public user: User;
    public adminremarks: string;

    constructor(
        id: string,
        remarks: string,
        status: string,
        createdby: User,
        modifiedby: User,
        createdon: Date,
        modifiedon: Date,
        roleid: string,
        user: User,
        adminremarks: string
    ) {
        this.id = id;
        this.remarks = remarks;
        this.status = status;
        this.createdby = createdby;
        this.modifiedby = modifiedby;
        this.createdon = createdon;
        this.modifiedon = modifiedon;
        this.roleid = roleid;
        this.user = user;
        this.adminremarks = adminremarks;
    }
}
