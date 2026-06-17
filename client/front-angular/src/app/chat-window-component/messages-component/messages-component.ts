import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatDataService, ChatMessage } from '../../services/chat-data.service';

@Component({
  selector: 'app-messages-component',
  templateUrl: './messages-component.html',
  styleUrls: ['./messages-component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollViewport') private scrollViewport!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [];
  private dataSubscription!: Subscription;
  private shouldScrollToBottom = false;

  constructor(
    private chatDataService: ChatDataService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataSubscription = this.chatDataService.messages$.subscribe((updatedStream) => {
      this.messages = updatedStream;
      this.shouldScrollToBottom = true; 

      this.cdr.detectChanges();
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      const element = this.scrollViewport.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.warn('Auto-scroll tracking broken:', err);
    }
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}