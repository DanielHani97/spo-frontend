import { User } from '../../model/user';
import { AssesmentQuestion } from './assesmentQuestion';
import { Technology } from '../../model/setup/technology';

export class Assesment {

    public id: string;
    public title: string;
    public details: string;
    public level: string;
    public category: string;
    public technology: Technology;
    public assesmentQuestion: AssesmentQuestion[];
    public questionno: number;
    public instanceid: string;
    public instancename: string;
    public user: User;

    constructor(
        id: string,
        title: string,
        details: string,
        level: string,
        category: string,
        technology: Technology,
        assesmentQuestion: AssesmentQuestion[],
        questionno: number,
        instanceid: string,
        instancename: string,
        user: User
    ) {
        this.id = id;
        this.title = title;
        this.details = details;
        this.level = level;
        this.category = category;
        this.technology = technology;
        this.assesmentQuestion = assesmentQuestion;
        this.questionno = questionno;
        this.instanceid = instanceid;
        this.instancename = instancename;
        this.user = user;
    }
}
