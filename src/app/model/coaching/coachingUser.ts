import { User } from '../../model/user';
import { Coaching } from '../../model/coaching/coaching';

export class CoachingUser {
	public user: User;
	public coaching: Coaching;
	public id: string;

	constructor(user:User, coaching:Coaching, id:string){

	this.user = user;
	this.coaching = coaching;
	this.id = id;
	}
}