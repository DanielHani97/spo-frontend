import { FeedbackSection } from "./feedbackSection";

export class Feedback {

    public id: string;
    public title: string;
    public objective: string;
    public type: string;
    public feedbackSection: FeedbackSection[];
    public instanceid: string;

    constructor(
        id: string,
        title: string,
        objective: string,
        type: string,
        feedbackSection: FeedbackSection[],
        instanceid: string
    ) {
        this.id = id;
        this.title = title;
        this.objective = objective;
        this.type = type;
        this.feedbackSection = feedbackSection;
        this.instanceid = instanceid;
    }
}
