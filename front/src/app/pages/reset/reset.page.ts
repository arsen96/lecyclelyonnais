import { Component, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage {
  @ViewChild('myForm') myForm: NgForm;

  messageService = inject(MessageService)
  loaderService = inject(LoadingService);

  constructor(public standardAuth:StandardAuth) {}

  ionViewWillEnter() {
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      const resetPassword = this.standardAuth.resetPassword(form.value);
      const result = this.loaderService.showLoaderUntilCompleted(resetPassword);
      result.subscribe({
        next : (res) => {
            this.messageService.showMessage(res, Message.success)
        },
        error : (err) => {
          this.messageService.showMessage(err, Message.danger)
        }
      })
    }
  }


  ionViewWillLeave() {
    this.messageService.hideMessage()
  }

}
