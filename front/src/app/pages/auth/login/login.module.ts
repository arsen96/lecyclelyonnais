import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { RouterLink } from '@angular/router';
import { MessageComponent } from 'src/app/components/message/message.component';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    MessageComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    IonicModule,
    LoginPageRoutingModule,
    AddressAutocompleteComponent 
  ],
})
export class LoginPageModule {}