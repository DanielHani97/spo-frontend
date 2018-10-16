import { Agency } from '../../model/setup/agency';
import { Technology } from '../../model/setup/technology';
import { User } from '../../model/user';

export class Infrastructure {

    public user: User;
    public type: string;
    public agency: Agency;
    public status: string;
    public remarks: string;
    public os: string;
    public vcpu: string;
    public memori: string;
    public rootDisk: string;
    public ephemeralDisk: string;
    public swapDisk: string;
    public persistentDisk: string;
    public webServer: string;
    public framework: Technology;
    public database: Technology;
    public language: string;
    public adminRemarks: string;
    public createdBy: User;
    public createdDate: Date;
    public modifiedBy: User;
    public modifiedDate: Date;
    public id: string;

    constructor(
        user: User,
        type: string,
        agency: Agency,
        status: string,
        remarks: string,
        os: string,
        vcpu: string,
        memori: string,
        rootDisk: string,
        ephemeralDisk: string,
        swapDisk: string,
        persistentDisk: string,
        webServer: string,
        framework: Technology,
        database: Technology,
        language: string,
        adminRemarks: string,
        createdBy: User,
        createdDate: Date,
        modifiedBy: User,
        modifiedDate: Date,
        id: string) {

        this.user = user;
        this.type = type;
        this.agency = agency;
        this.status = status;
        this.remarks = remarks;
        this.os = os;
        this.vcpu = vcpu;
        this.memori = memori;
        this.rootDisk = rootDisk;
        this.ephemeralDisk = ephemeralDisk;
        this.swapDisk = swapDisk;
        this.persistentDisk = persistentDisk;
        this.webServer = webServer;
        this.framework = framework;
        this.database = database;
        this.language = language;
        this.adminRemarks = adminRemarks;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.modifiedBy = modifiedBy;
        this.modifiedDate = modifiedDate;
        this.id = id;

    }
}
