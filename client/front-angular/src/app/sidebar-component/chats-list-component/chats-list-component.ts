import { Component } from '@angular/core';
import { ChatDataService } from '../../services/chat-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chats-list-component',
  imports: [FormsModule],
  templateUrl: './chats-list-component.html',
  styleUrl: './chats-list-component.scss',
})
export class ChatsListComponent {
  targetChatId: string = '';

  constructor(private chatDataService: ChatDataService) {}

  selectChatRoom(): void {
    const chatId = this.targetChatId.trim();
    
    if (chatId) {
      this.chatDataService.selectChat(chatId);
      console.log(`Switched context to room ID: ${chatId}`);
    } else {
      alert('Please enter a valid Chat ID');
    }
  }
}
