import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.page.html',
  styleUrls: ['./admins.page.scss'],
})
export class AdminsPage implements OnInit {
  adminForm: FormGroup;
  showPassword = false;
  messageService = inject(MessageService);
  adminService = inject(AdminService);
  loaderService = inject(LoadingService);
  router = inject(Router);
  error = { type: 'register' };
  selectedAdmin: any = null;
  resetPasswordMode = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.adminForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.selectedAdmin ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const adminId = +params.get('id');

      if (adminId) {
        this.loadAdminDetails(adminId);
        this.adminForm.get('password').clearValidators();
        this.adminForm.get('password').updateValueAndValidity();
      }
    });
  }

  loadAdminDetails(adminId: number) {
    this.adminService.get().then((res: any) => {
      this.selectedAdmin = this.adminService.allAdmins.find(admin => admin.id === adminId);
      if (this.selectedAdmin) {
        this.adminForm.patchValue({
          first_name: this.selectedAdmin.first_name,
          last_name: this.selectedAdmin.last_name,
          email: this.selectedAdmin.email
        });

        this.adminForm.get('password').clearValidators();
        this.adminForm.get('password').updateValueAndValidity();
      }
    });
    this.resetPasswordMode = false;
  }

  updateAdmin() {
    if (this.adminForm.valid) {
      const updatedAdmin = { id: this.selectedAdmin.id, ...this.adminForm.value };
      if (!this.resetPasswordMode || this.adminForm.get('password').value) {
        this.adminService.update(updatedAdmin).subscribe({
          next: (data:any) => {
            this.messageService.showToast(data.message, 'success');
            this.adminService.allAdmins = [];
            this.router.navigateByUrl("admins-list").then(() => {
              this.selectedAdmin = null;
            });
          },
          error: (err) => {
            this.messageService.showToast(err, 'danger');
            console.error(err);
          }
        });
      } else {
        this.messageService.showMessage('Veuillez entrer un nouveau mot de passe.', Message.danger);
      }
    }
  }

  generatePassword() {
    const newPassword = Math.random().toString(36).slice(-8);
    this.adminForm.patchValue({ password: newPassword });
    this.showPassword = true;
  }

  displayError(error: string) {
    this.messageService.showMessage(error, Message.danger);
  }

  async onSubmitAdmin() {
    if (this.selectedAdmin) {
      this.updateAdmin();
    } else {
      if (this.adminForm.valid) {
        const register$ = this.adminService.create(this.adminForm.value);
        const result = this.loaderService.showLoaderUntilCompleted(register$);
        result.subscribe({
          next: (res) => {
            this.router.navigateByUrl("admins-list");
          },
          error: (err) => {
            this.displayError(err);
          }
        });
      } else {
        this.messageService.showMessage('Veuillez remplir tous les champs requis.', Message.danger);
      }
    }
  }

  ionViewWillLeave() {
    this.messageService.clearMessage();
  }

  enablePasswordReset() {
    this.resetPasswordMode = true;
    this.adminForm.patchValue({ password: '' });
    this.adminForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
    this.adminForm.get('password').updateValueAndValidity();
  }
}
