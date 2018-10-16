import { User } from '../../model/user';

export class FeedbackSectionQuestion {

    public id: string;
    public title: string;
    public type: string;
    public min: number;
    public max: number;
    public minlbl: string;
    public maxlbl: string;
    public detail: string;
    public user: User;
    public scale: any[];

    constructor(
        id: string,
        title: string,
        type: string,
        min: number,
        max: number,
        minlbl: string,
        maxlbl: string,
        detail: string,
        user: User,
        scale: any[]
    ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.min = min;
        this.max = max;
        this.minlbl = minlbl;
        this.maxlbl = maxlbl;
        this.detail = detail;
        this.user = user;
        this.scale = scale;
    }
}
