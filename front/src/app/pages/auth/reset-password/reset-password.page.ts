import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { Message, MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  @ViewChild('myForm') myForm: NgForm;
  token:string
  messageService = inject(MessageService)
  router = inject(Router);
  constructor(private route: ActivatedRoute,public standardAuth:StandardAuth) { }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log('Token reçu : ', this.token);
  }

  resetPassword(newPassword: string) {

  }

  onSubmit() {
    if (this.myForm.valid) {
      if(this.myForm.value.password === this.myForm.value.password_confirm){
        const result$ = this.standardAuth.confirmResetPassword({...this.myForm.value,token : this.token});
        result$.subscribe({
            next : (result) => {
              this.messageService.showMessage(result, Message.success)
              setTimeout(() => {
                this.router.navigateByUrl("/login");
              }, 2000);
            },
            error : (err) => {
              this.messageService.showMessage(err, Message.danger)
            }
        })
      }
    }
  }


  ionViewWillLeave() {
    this.messageService.clearMessage()
  }

}
