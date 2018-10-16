import { User } from '../../model/user';
import { Training } from '../../model/training/training';
import { Manday } from '../../model/setup/manday';

export class TrainingTx {

    public user: User;
    public training: Training;
    public manday: Manday;
    public coach_remarks: string;
    public admin_remarks: string;
    public status: string;
    public qualification: string;
    public id: string;
    public createdBy: User;
    public evaluatedBy: User;
    public approvedBy: User;


    constructor(user: User, training: Training, manday: Manday, coach_remarks: string, admin_remarks: string, status: string, qualification: string, id: string, createdBy: User, evaluatedBy: User, approvedBy: User) {
        this.user = user;
        this.training = training;
        this.manday = manday;
        this.coach_remarks = coach_remarks;
        this.admin_remarks = admin_remarks;
        this.status = status;
        this.qualification = qualification;
        this.id = id;
        this.createdBy = createdBy;
        this.evaluatedBy = evaluatedBy;
        this.approvedBy = approvedBy;

    }
}
