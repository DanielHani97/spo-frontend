import { User } from '../../model/user';
import { Coaching } from '../../model/coaching/coaching';

export class CoachingCoach {
    public coach: User;
    public coaching: Coaching;
    public id: string;

    constructor(coach: User, coaching: Coaching, id: string) {

        this.coach = coach;
        this.coaching = coaching;
        this.id = id;
    }
}