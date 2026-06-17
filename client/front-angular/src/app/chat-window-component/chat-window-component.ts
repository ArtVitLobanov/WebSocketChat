import { Component } from '@angular/core';
import { ChatHeaderComponent } from './chat-header-component/chat-header-component';
import { InputComponent } from './input-component/input-component';
import { MessagesComponent } from './messages-component/messages-component';

@Component({
  selector: 'app-chat-window-component',
  imports: [ChatHeaderComponent, InputComponent, MessagesComponent],
  templateUrl: './chat-window-component.html',
  styleUrl: './chat-window-component.scss',
})
export class ChatWindowComponent {}
