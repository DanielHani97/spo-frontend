export class Manday{

	public id: string;
	public category: string;
	public total: number;
	public mandayUsed: number;
	public mandayReserved: string;
	

	constructor(category:string, total:number, mandayUsed: number, mandayReserved: string, id:string){

	this.category = category;	
	this.total = total;
	this.mandayUsed = mandayUsed;
	this.mandayReserved = mandayReserved;
	this.id = id;
	
	}
}