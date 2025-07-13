import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { RouterLink } from '@angular/router';
import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from 'src/app/components/message/message.component';
import { Loader } from '@googlemaps/js-api-loader';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { environment } from 'src/environments/environment';
@NgModule({
  imports: [
    NgxGpAutocompleteModule,
    CommonModule,
    MessageComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CoolSocialLoginButtonsModule,
    FontAwesomeModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage],
  exports: [
    LoginPage
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: environment.GOOGLE_MAP_API,
        libraries: ['places']
      })
    },
  ]
})
export class LoginPageModule {}
