import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent{
  displayMessage = false;
  message:Observable<string[]>;
  constructor(public messageService:MessageService){
    this.messageService.message$.subscribe((data) => {
      this.displayMessage = !!data;
      console.log("datadata",data)
      if (!data) {
        this.message = null;
      }
    })
  }

  close(){
    this.displayMessage = false;
    this.messageService.clearMessage();
  }

}
