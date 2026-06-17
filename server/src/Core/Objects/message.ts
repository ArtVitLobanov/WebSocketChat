
export interface IContent {
    getContent(): string;
    getType(): string;
    toJson(): any;
}

export class TextContent implements IContent{
    private content: string;
    private type: string = "text";

    constructor(content: string){
        this.content = content
    }
    
    public getContent(){
        return this.content
    }

    public getType(){
        return this.type
    }

    public toJson(): any{
        return {
            content: this.getContent(),
            type: this.getType()
        }
    }
}

export class ImageContent implements IContent{
    private content: string;
    private type: string = "image";

    constructor(content: string){
        this.content = content
    }
    
    public getContent(){
        return this.content
    }

    public getType(){
        return this.type
    }

    public toJson(): any{
        return {
            content: this.getContent(),
            type: this.getType()
        }
    }
}

export class VideoContent implements IContent{
    private content: string;
    private type: string = "video";

    constructor(content: string){
        this.content = content
    }
    
    public getContent(){
        return this.content
    }

    public getType(){
        return this.type
    }

    public toJson(): any{
        return {
            content: this.getContent(),
            type: this.getType()
        }
    }
}

export interface IMessage {
    get_id() : number;
    set_id(id : number) : void;
    get_content() : string;
    get_owner_id() : number;
    get_owner_name() : string 
    get_time() : string;
    set_time(time : string) : void;
    get_type() : string;
    toJson() : any;
}

export class Message implements IMessage {

    private messageId: number;
    private messageContent: IContent;

    private ownerId: number
    private ownerName: string 

    private time : string

    constructor(owner_id: number, owner_name: string, content: IContent, messageId: number){
        this.messageId = messageId;
        this.messageContent = content;
        this.ownerId = owner_id;
        this.ownerName = owner_name;
        this.time = new Date().toLocaleString();
    }

    public get_id() : number {
        return this.messageId;
    }

    public set_id(id : number){
        this.messageId = id;
    }

    public get_content() : string{
        return this.messageContent.getContent();
    }

    public get_owner_id(): number {
        return this.ownerId;
    }

    public get_owner_name(): string{
        return this.ownerName;
    }

    public get_time() : string {
        return this.time
    }

    public set_time(time: string) : void {
        this.time = time;
    }

    public get_type() : string {
        return this.messageContent.getType();
    }

    public toJson() : any {
        return {
            messageId: this.get_id(),
            messageContent: this.messageContent.toJson(),
            ownerId: this.get_owner_id(),
            ownerName: this.get_owner_name(),
            time: this.get_time()
        }
    }
}

export class MessageFactory {
    constructor() {};

    public get_message(ownerId: number, ownerName: string, content: IContent, messageId: number) : IMessage {
        let message = new Message(ownerId, ownerName, content, messageId);
        return message
    }
}