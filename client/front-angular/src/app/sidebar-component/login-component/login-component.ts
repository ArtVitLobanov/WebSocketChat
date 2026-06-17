import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChatDataService } from '../../services/chat-data.service';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  
  //backend
  private readonly AUTH_URL = 'http://localhost:5000/auth';

  constructor(private http: HttpClient, private chatDataService: ChatDataService) {}

  onLogin(): void {
    const cleanUser = this.username.trim();
    const cleanPass = this.password.trim();

    if (!cleanUser || !cleanPass) return;

    const payload = {
      userName: cleanUser,
      password: cleanPass
    };

    console.log('Attempting authentication for:', cleanUser);

    this.chatDataService.login(payload.userName, payload.password);
  }
}
