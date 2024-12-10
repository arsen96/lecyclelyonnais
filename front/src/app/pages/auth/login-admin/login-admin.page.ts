import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { TechnicianService } from 'src/app/services/technician.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.page.html',
  styleUrls: ['./login-admin.page.scss'],
})
export class LoginAdminPage implements OnInit {
  loginForm: FormGroup;
  displayMsg = false;
  formSubmitted = false;
  messageService = inject(MessageService);
  adminService = inject(AdminService);
  public router = inject(Router); 
  public loaderService = inject(LoadingService); 
  public globalService = inject(GlobalService); 
  public bicycleService = inject(BicycleService);
  public technicianService = inject(TechnicianService);
  public interventionService = inject(InterventionService); 

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const auth$ = this.adminService.login(email, password);
      const result = this.loaderService.showLoaderUntilCompleted(auth$);
      result.subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.messageService.clearMessage();  
          this.globalService.loadAllData(this.bicycleService,this.technicianService,this.interventionService);
          this.router.navigateByUrl('admins-list');
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.messageService.showMessage(error.error.message, Message.danger);
          this.displayMsg = true;
        }
      });
    } else {
      this.messageService.showMessage('Veuillez remplir tous les champs requis.', Message.danger);
      this.displayMsg = true;
    }
  }


  ionViewWillLeave(){
    this.messageService.clearMessage();
  }
}
