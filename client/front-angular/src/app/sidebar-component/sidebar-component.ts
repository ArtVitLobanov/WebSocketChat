import { Component } from '@angular/core';
import { LoginComponent } from './login-component/login-component';
import { ChatsListComponent } from './chats-list-component/chats-list-component';

@Component({
  selector: 'app-sidebar-component',
  imports: [LoginComponent, ChatsListComponent],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent {}
