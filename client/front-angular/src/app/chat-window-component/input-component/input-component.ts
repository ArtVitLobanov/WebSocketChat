import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatDataService } from '../../services/chat-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-component',
  imports: [FormsModule],
  templateUrl: './input-component.html',
  styleUrl: './input-component.scss',
})
export class InputComponent {
  messageText: string = '';

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(private chatDataService: ChatDataService) {}

  sendTextMessage(): void {
    const cleanText = this.messageText.trim();
    if (cleanText) {
      this.chatDataService.sendMessage(cleanText, 'text');
      console.log("SENDING MESSAGE");
      this.messageText = '';
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    
    if (!file) return;

    let fileTag = 'text';
    if (file.type.startsWith('image/')) {
      fileTag = 'image';
    } else if (file.type.startsWith('video/')) {
      fileTag = 'video';
    } else {
      console.warn('Unsupported file type selected:', file.type);
      return;
    }

    const reader = new FileReader();
    reader.onload = (fileEvent: ProgressEvent<FileReader>) => {
      const base64String = fileEvent.target?.result as string;
      
      if (base64String) {
        this.chatDataService.sendMessage(base64String, fileTag);
        this.resetFileInput();
      }
    };
    
    reader.readAsDataURL(file);
  }

  private resetFileInput(): void {
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
}
