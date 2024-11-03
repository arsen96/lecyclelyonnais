import { ChangeDetectorRef, Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HttpClient } from '@angular/common/http';
import { OauthService } from 'src/app/services/auth/oauth.service';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { GlobalService } from 'src/app/services/global.service';
import { CookieService } from 'ngx-cookie-service';

export class FormRegisterModel {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  phone: string = '';
  address: string = '';
}

export class FormLoginModel {
  email: string = '';
  password: string = '';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{
  // public globalService = inject(GlobalService);
  public standardAuthService = inject(StandardAuth)
  public loaderService = inject(LoadingService);
  public oauthService = inject(OauthService)
  public router = inject(Router)
  public http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  formBuilder = inject(FormBuilder)
  public globalService = inject(GlobalService)
  cookieService = inject(CookieService)
  faGoogle = faGoogle
  faLinkedin = faLinkedin
  modelLogin: FormLoginModel = { email: "", password: "" };
  public error = {
    type: 'login' || 'register'
  }

  registrationForm: FormGroup;

  constructor(public route: ActivatedRoute, public messageService: MessageService) {
    this.route.fragment.subscribe(async (fragment) => {
      if (fragment) {
        const fragmentParams = new URLSearchParams(fragment);
        const accessToken = fragmentParams.get('id_token') as string;
        const result = this.oauthService.decodeJWT(accessToken);

        if (result.email_verified) {
          this.loaderService.setLoading(true);
            try{
              await this.oauthService.loginOauthApi(result.email);
              this.router.navigateByUrl("home").then(() => {
                this.globalService.isAuthenticated.next(true)
                this.loaderService.setLoading(false)
              })
            }catch(err){
              this.oauthService.oAuthService.logOut(true);
              this.loaderService.setLoading(false)
              this.displayError(err,'login')
            }
        }
      }
    })
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(2)]]
    });

  }

  get f() {
    return this.registrationForm.controls;
  }



  async onSubmitLogin() {
    const login$ = this.standardAuthService.loginStandard(this.modelLogin);
    const result = this.loaderService.showLoaderUntilCompleted(login$);
    result.subscribe(
      {
        next: () => {
          this.router.navigateByUrl("zones-list")
        }, error: (err) => {
          this.displayError(err,'login')
          console.log("login error", err)
        }
      }
    )

  }

  displayError(err: string, type?: 'login' | 'register') {
    if (type) {
      this.error.type = type
    }
    console.log("this.error",this.error)
    this.messageService.showMessage(err, Message.danger)
  }



  async onSubmitRegister() {
    if (this.registrationForm.valid) {
      const register$ = this.standardAuthService.register(this.registrationForm.value);
      const result = this.loaderService.showLoaderUntilCompleted(register$);
      result.subscribe({
        next: (res) => {
          this.router.navigateByUrl('zones-list')
        }, error: (err) => {
          this.displayError(err, 'register')
          console.log("register error", err)
        }
      })
    }

  }

  onGoogleLogin() {
    this.oauthService.loginOauth();
  }



  ionViewWillLeave() {
    this.messageService.hideMessage()
  }

}
