export class Training {

    public title: string;
    public technology: string;
    public name: string;
    public duration: string;
    public start_date: string;
    public status: string;

    constructor(title: string, technology: string, name: string, duration: string, start_date: string, status: string) {
        this.title = title;
        this.technology = technology;
        this.name = name;
        this.duration = duration;
        this.start_date = start_date;
        this.status = status;

    }
}
