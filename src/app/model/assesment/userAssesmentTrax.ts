import { User } from '../../model/user';
import { UserAssesment } from './userAssesment';

export class UserAssesmentTrax {

    public id: string;
    public userAssesId: string;
    public questionId: string;
    public answerId: string;
    public question: string;
    public answer: string;
    public user: User;
    public mark: number;
    public userAssesment: UserAssesment;
    public level: string;
    public userId: string;
    public technologyId: string;

    constructor(
        id: string,
        userAssesId: string,
        questionId: string,
        answerId: string,
        question: string,
        answer: string,
        user: User,
        mark: number,
        userAssesment: UserAssesment,
        level: string,
        userId: string,
        technologyId: string
    ) {
        this.id = id;
        this.userAssesId = userAssesId;
        this.questionId = questionId;
        this.answerId = answerId;
        this.question = question;
        this.answer = answer;
        this.user = user;
        this.mark = mark;
        this.userAssesment = userAssesment;
        this.level = level;
        this.userId = userId;
        this.technologyId = technologyId;
    }
}
