export interface IUser{
    get_id() : number;
    get_name() : string;
}

export class User implements IUser{
    userId: number;
    userName: string;
    
    constructor(name: string, id: number){
        this.userName = name;
        this.userId = id;
    }

    public get_id() : number {
        return this.userId;
    }

    public get_name() : string {
        return this.userName;
    }
}

