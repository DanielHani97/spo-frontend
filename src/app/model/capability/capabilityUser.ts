import { User } from '../../model/user';
import { Capability } from './capability';

export class CapabilityUser {
	public user: User;
	public capability: Capability;
	public status: string;
	public coach_remarks: string;
	public admin_remarks: string;
	public createdBy: User;
	public evaluatedBy: User;
	public approvedBy: User;
	public id: string;

	constructor(
		user:User, 
		capability: Capability, 
		status:string, 
		coach_remarks:string, 
		admin_remarks:string, 
		createdBy: User,
		evaluatedBy: User,
		approvedBy: User,
		id:string){

	this.user = user;
	this.capability = capability;
	this.status = status;
	this.coach_remarks = coach_remarks;
	this.admin_remarks = admin_remarks;
	this.createdBy = createdBy;
	this.evaluatedBy = evaluatedBy;
	this.approvedBy = approvedBy;
	this.id = id;
	}
}