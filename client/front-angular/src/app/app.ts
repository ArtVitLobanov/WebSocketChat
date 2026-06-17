import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar-component/sidebar-component';
import { ChatWindowComponent } from './chat-window-component/chat-window-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, ChatWindowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-angular');
}
