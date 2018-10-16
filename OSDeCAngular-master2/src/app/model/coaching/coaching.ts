import { Agency } from '../../model/setup/agency';
import { Technology } from '../../model/setup/technology';
import { User } from '../../model/user';
import { Filestorage } from '../../model/ref/filestorage';

export class Coaching {

    public name: string;
    public user: User;
    public agency: Agency;
    public status: string;
    public frontend: Technology;
    public backend: Technology;
    public database: Technology;
    public frontendlevel: string;
    public backendlevel: string;
    public databaselevel: string;
    public remarks: string;
    public admin_remarks: string;
    public coach_remarks: string;
    public starting_date: Date;
    public ending_date: Date;
    public kelayakan: string;
    public mandayUsed: string;
    public mandayReserved: string;
    public createdBy: User;
    public modifiedBy: User;
    public evaluatedBy: User;
    public approvedBy: User;
    public verifiedBy: User;
    public id: string;
    public urs: Filestorage;
    public srs: Filestorage;
    public sds: Filestorage;

    constructor(
        name: string,
        user: User,
        agency: Agency,
        status: string,
        frontend: Technology,
        backend: Technology,
        database: Technology,
        frontendlevel: string,
        backendlevel: string,
        databaselevel: string,
        remarks: string,
        admin_remarks: string,
        coach_remarks: string,
        starting_date: Date,
        ending_date: Date,
        kelayakan: string,
        mandayUsed: string,
        mandayReserved: string,
        createdBy: User,
        modifiedBy: User,
        evaluatedBy: User,
        approvedBy: User,
        verifiedBy: User,
        id: string,
        urs: Filestorage,
        srs: Filestorage,
        sds: Filestorage) {

        this.name = name;
        this.user = user;
        this.agency = agency;
        this.status = status;
        this.frontend = frontend;
        this.backend = backend;
        this.database = database;
        this.frontendlevel = frontendlevel;
        this.backendlevel = backendlevel;
        this.databaselevel = databaselevel;
        this.remarks = remarks;
        this.admin_remarks = admin_remarks;
        this.coach_remarks = coach_remarks;
        this.starting_date = starting_date;
        this.ending_date = ending_date;
        this.kelayakan = kelayakan;
        this.mandayUsed = mandayUsed;
        this.mandayReserved = mandayReserved;
        this.createdBy = createdBy;
        this.modifiedBy = modifiedBy;
        this.evaluatedBy = evaluatedBy;
        this.approvedBy = approvedBy;
        this.verifiedBy = verifiedBy;
        this.id = id;
        this.urs = urs;
        this.srs = srs;
        this.sds = sds;

    }
}
