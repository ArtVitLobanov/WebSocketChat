import type { IUser } from "./user.js";

import type { IMessage } from "./message.js"
import { MessageFactory } from "./message.js";

import { type IContent } from "./message.js";

export interface IChat{
    get_id() : number;
    get_participants() : number[];
    get_history() : IMessage[];
    add_participant(userId: number) : void;
    add_message(senderId: number, senderName: string, content: IContent, messageId: number) : void;
}

export class Chat implements IChat {
    private chatId: number;
    private chatParticipants: number[];
    private chatHistory: IMessage[];

    private chatMessageFactory: MessageFactory;

    constructor(id: number, history: IMessage[], participants: number[]){
        this.chatId = id;
        this.chatParticipants = participants;
        this.chatHistory = history;

        this.chatMessageFactory = new MessageFactory();
    }

    public get_id() : number {
        return this.chatId;
    }

    public get_participants() : number[] {
        return this.chatParticipants;
    }
    
    public get_history() : IMessage[] {
        return this.chatHistory;
    }

    public add_participant(userId: number){

        if (this.chatParticipants.length == 0){
            this.chatParticipants.push(userId)
        } else {
            let user_in_participants = false;
            for (let user of this.chatParticipants){
                if (user == userId){
                    user_in_participants = true;
                }
            }

            if (user_in_participants == false){
                this.chatParticipants.push(userId)
            }
        }
    }

    public add_message(senderId: number, senderName: string, content: IContent, messageId: number) {
        this.add_participant(senderId);
        this.chatHistory.push(this.chatMessageFactory.get_message(senderId, senderName, content, messageId))
    }

    public test_display_messages(){
        for (let message of this.chatHistory){
            console.log(" - Message from: " + message.get_owner_id() + ", " + "at " + message.get_time())
            console.log("\t : " + message.get_content())
        }
    }
}