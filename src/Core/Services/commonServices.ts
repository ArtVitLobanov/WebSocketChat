
import type { Request, Response, NextFunction } from 'express';

import { Chat, type IChat } from '../Objects/chat.js';
import { type IContent, TextContent, VideoContent, ImageContent, type IMessage, Message } from '../Objects/message.js';
import { type IUser } from '../Objects/user.js';

import { ChatModel } from '../Objects/db.js';

export class CommonServices {
    private constructor(){}

    public static async fetchHistory(chat: IChat, socket: any){
      for (let message of chat.get_history().slice(-chat.get_history().length)){
        socket.emit("chatMessage", message);
      }
    }
    
    public static async checkIfUserInChatDB(userId: number, chatId: number): Promise<boolean> {
      let chatDB = await ChatModel.findOne({chatId: chatId});
      let isInChatDB = false;
    
      for (let id of chatDB?.chatParticipants){
        if (id == userId){
          isInChatDB = true;
          break;
        }
      }
    
      return isInChatDB;
    }
    
    public static async loadChat(chatId: number): Promise<IChat | null> {
      let dbChat = await ChatModel.findOne({chatId: chatId});
    
      if (dbChat){
    
        let loadedHistory: IMessage[] = dbChat.chatHistory.map((data: any) =>{
          let msg: IMessage;
          let content: IContent;
          
          switch (data.messageContent.type) {
            case "text": {
              content = new TextContent(data.messageContent.content);
              break;
            }
            case "image": {
              content = new ImageContent(data.messageContent.content);
              break;
            }
            case "video": {
              content = new VideoContent(data.messageContent.content)
            }
          }
          
          msg = new Message(data.ownerId, data.ownerName, content, data.messageId)
          msg.set_id(data.messageId)
          msg.set_time(data.time)
    
          return msg
        })
    
        let loadedChat = new Chat(dbChat.chatId, loadedHistory, dbChat.chatParticipants)
        return loadedChat;
      } else {
        return null;
      }
      
    }
    
    public static async getLastMessageId(chatId: number): Promise<number> {
      const chatDoc = await ChatModel.findOne(
        { chatId: chatId },
        { chatHistory: { $slice: -1 } }
      );
    
      if (chatDoc && chatDoc.chatHistory && chatDoc.chatHistory.length > 0) {
        let lastMessage = chatDoc.chatHistory[0];
    
        if (lastMessage == undefined ) {
          return 0
        } else {
          return lastMessage.messageId;
        }
      } else {
        return 0;
      }
    }

    public static async uploadMessageToDB(chat: IChat, user: IUser, message: IMessage){
        if (await CommonServices.checkIfUserInChatDB(user.get_id(), chat.get_id())){
        await ChatModel.updateOne(
        { chatId:chat.get_id()},
        {
         $push: { 
            chatHistory: message?.toJson(),
          }
        }
      );
      } else {
        await ChatModel.updateOne(
        { chatId: chat.get_id()},
        {
         $push: { 
            chatHistory: message?.toJson(),
            chatParticipants: user.get_id()
          }
        }
      );
      }
    }
}