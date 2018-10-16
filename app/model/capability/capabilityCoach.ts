import { User } from '../../model/user';
import { Capability } from './capability';

export class CapabilityCoach {
    public coach: User;
    public capability: Capability;
    public id: string;

    constructor(coach: User, capability: Capability, id: string) {

        this.coach = coach;
        this.capability = capability;
        this.id = id;
    }
}