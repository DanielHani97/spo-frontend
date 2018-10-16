export class Grade {

    public name: string;
    public seniority: number;
    public status: string;
    public id: string;


    constructor(name: string, seniority: number, status: string, id: string) {
        this.name = name;
        this.seniority = seniority;
        this.status = status;
        this.id = id;

    }
}
