export class City {

    public id: string;
    public name: string;
    public state_id: string;

    constructor(id: string, name: string, state_id: string) {
        this.id = id;
        this.name = name;
        this.state_id = state_id;
    }
}
