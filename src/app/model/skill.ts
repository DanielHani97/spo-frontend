import { Technology } from '../model/setup/technology';
import { User } from '../model/user';

export class Skill {

    public id: string;
    public technology: Technology;
    public level: string;
    public user: User;
    public mark: number;

    constructor(id: string, technology: Technology, level: string, user: User, mark: number) {
        this.id = id;
        this.technology = technology;
        this.level = level;
        this.user = user;
        this.mark = mark;

    }
}
