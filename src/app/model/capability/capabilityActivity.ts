import { Capability } from '../../model/capability/capability';
import { User } from '../../model/user';

export class CapabilityActivity {

    public name: string;
    public attendance: string;
    public venue: string;
    public duration: string;
    public start_date: string;
    public end_date: string;
    public capability: Capability;
    public keygen: string;
    public id: string;
    public userLs: User[];
    public done: boolean;

    constructor(
        name: string,
        attendance: string,
        venue: string,
        duration: string,
        start_date: string,
        end_date: string,
        capability: Capability,
        keygen: string,
        id: string,
        userLs: User[],
        done: boolean
    ) {

        this.name = name;
        this.attendance = attendance;
        this.venue = venue;
        this.duration = duration;
        this.start_date = start_date;
        this.end_date = end_date;
        this.capability = capability;
        this.keygen = keygen;
        this.id = id;
        this.userLs = userLs;
        this.done = done;
    }
}
