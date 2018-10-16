import { UserFeedbackSection } from "./userFeedbackSection";

export class UserFeedback {

    public id: string;
    public title: string;
    public objective: string;
    public type: string;
    public userFeedbackSection: UserFeedbackSection[];

    constructor(
        id: string,
        title: string,
        objective: string,
        type: string,
        userFeedbackSection: UserFeedbackSection[]
    ) {
        this.id = id;
        this.title = title;
        this.objective = objective;
        this.type = type;
        this.userFeedbackSection = userFeedbackSection;
    }
}
