import { Coaching } from '../../model/coaching/coaching';
import { User } from '../../model/user';

export class CoachingActivity {

	public name: string;
	public attendance: string;
	public venue: string;
	public duration: string;
	public start_date: string;
	public end_date: string;
	public coaching: Coaching;
	public kelulusan: string;
	public id: string;
	public userLs: User[];
	public done: boolean;
	public instanceId: string;

	constructor(
		name:string,
		attendance:string,
		venue:string,
		duration:string,
		start_date:string,
		end_date:string,
		coaching:Coaching,
		kelulusan: string,
		id:string,
		userLs: User[],
		done: boolean,
		instanceId: string
	){

		this.name = name;
		this.attendance = attendance;
		this.venue = venue;
		this.duration = duration;
		this.start_date = start_date;
		this.end_date = end_date;
		this.coaching = coaching;
		this.kelulusan = kelulusan;
		this.id = id;
		this.userLs = userLs;
		this.done = done;
		this.instanceId = instanceId;
	}
}
