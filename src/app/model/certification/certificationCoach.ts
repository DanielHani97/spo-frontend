import { User } from '../../model/user';
import { Certification } from '../../model/certification/certification';

export class CertificationCoach {
    public coach: User;
    public certification: Certification;
    public id: string;

    constructor(coach: User, certification: Certification, id: string) {

        this.coach = coach;
        this.certification = certification;
        this.id = id;
    }
}