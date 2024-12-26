import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { ClientService } from 'src/app/services/client.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  registrationForm: FormGroup;
  editForm: FormGroup;
  addressValidated = false;
  showPassword = false;
  messageService = inject(MessageService);
  standardAuthService = inject(StandardAuth);
  loaderService = inject(LoadingService);
  router = inject(Router);
  clientService = inject(ClientService);
  error = { type: 'register' };
  selectedUser: any = null;
  globalService = inject(GlobalService);
  resetPasswordMode = false;
  

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.selectedUser ? [] : [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.minLength(2)]
    });
  }


  get UserRole() {
    return UserRole
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userId = +params.get('id');

      console.log("ape", userId);
      if (userId) {
        this.loadUserDetails(userId);
        this.registrationForm.get('password').clearValidators();
        this.registrationForm.get('password').updateValueAndValidity();
      }
    });

    // Log the form status
    this.registrationForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
    });
  }

  loadUserDetails(userId: number) {
    this.clientService.getClients().then((res: any) => {
      this.selectedUser = this.clientService.allClients.find(user => user.id === userId);
      console.log("selectedUser", this.selectedUser);
      if (this.selectedUser) {
        this.registrationForm.patchValue({
          firstName: this.selectedUser.first_name,
          lastName: this.selectedUser.last_name,
          email: this.selectedUser.email,
          phone: this.selectedUser.phone,
          address: this.selectedUser.address
        });

        // Ensure password validators are cleared
        this.registrationForm.get('password').clearValidators();
        this.registrationForm.get('password').updateValueAndValidity();
      }
    });
  } 

  updateUser() {
    if (this.registrationForm.valid) {
      const updatedUser = { id: this.selectedUser.id, ...this.registrationForm.value };
      if (!this.resetPasswordMode || this.registrationForm.get('password').value) {
        this.clientService.updateClient(updatedUser).subscribe({
          next: (result) => {
            this.messageService.showToast(result.message, Message.success);
            this.clientService.allClients = [];
            // this.globalService.user
            this.globalService.user.next(result.data);
            const link = this.globalService.userRole.getValue() === UserRole.CLIENT ? 'actions' : 'users-list';

            this.router.navigateByUrl(link).then(() => {
              this.selectedUser = null;
            });
          },
          error: (err) => {
            this.messageService.showToast(err, Message.danger);
            console.error(err);
          }
        });
      } else {
        this.messageService.showMessage('Veuillez entrer un nouveau mot de passe.', Message.danger);
      }
    }
  }

  handleAddressChange(place: any) {
    if (place.geometry) {
      console.log(place);
      this.registrationForm.patchValue({ address: place.formatted_address });
      this.addressValidated = true;
    }
  }

  generatePassword() {
    const newPassword = Math.random().toString(36).slice(-8);
    this.registrationForm.patchValue({ password: newPassword });
    this.showPassword = true;
  }

  displayError(error: string) {
    this.messageService.showMessage(error, Message.danger);
  }

  async onSubmitRegister() {
    if (this.selectedUser) {
      this.updateUser();
    } else {
      if (this.registrationForm.valid && this.addressValidated) {
        const register$ = this.standardAuthService.register(this.registrationForm.value);
        const result = this.loaderService.showLoaderUntilCompleted(register$);
        result.subscribe({
          next: (res) => {
            this.router.navigateByUrl("list-zones");
          },
          error: (err) => {
            this.displayError(err);
          console.log("register error", err);
          }
        });
      } else {
        this.messageService.showMessage('Veuillez sélectionner une adresse valide.', Message.danger);
      }
    }
  }

  ionViewWillLeave() {
    this.messageService.clearMessage();
  }

  enablePasswordReset() {
    this.resetPasswordMode = true;
    this.registrationForm.patchValue({ password: '' });
    this.registrationForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
    this.registrationForm.get('password').updateValueAndValidity();
  }
}
