import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';

export interface ChatMessage {
  ownerName: string;
  time: string;
  messageId: string;
  messageContent: {
    type: 'text' | 'image' | 'video';
    content: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
  private socket;
  private readonly SERVER_URL = 'http://localhost:5000';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(private ngZone: NgZone) {
    this.socket = io(this.SERVER_URL, {
      transports: ['websocket', 'polling'] 
    });

    this.socket.on('chatMessage', (message: ChatMessage) => {
      this.ngZone.run(() => {
        const currentStream = this.messagesSubject.getValue();
        this.messagesSubject.next([...currentStream, message]);
      })
    });

    this.socket.on('selectChat', () => {
    });
  }

  login(name: string, password: string) {
    if (this.socket){
      this.socket.emit("login", name, password);
    }
  }

  selectChat(chatId: string) {
    if (this.socket) {
      this.socket.emit("selectChat", chatId);

      this.messagesSubject.next([]);
    }
  }

  sendMessage(message: string, type: string) {
    if (this.socket) {
      console.log("chat-data.service.ts: sendMessage()")
      this.socket.emit("sendMessage", message, type);
  }
  }
}