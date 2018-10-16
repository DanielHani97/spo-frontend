import { User } from '../../model/user';
import { Training } from '../../model/training/training';

export class TrainingCoach {
    public coach: User;
    public training: Training;
    public id: string;

    constructor(coach: User, training: Training, id: string) {

        this.coach = coach;
        this.training = training;
        this.id = id;
    }
}