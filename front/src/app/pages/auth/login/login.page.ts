import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faLinkedin, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { OauthService } from 'src/app/services/auth/oauth.service';
import { StandardAuth } from 'src/app/services/auth/standard.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { GlobalService } from 'src/app/services/global.service';
import { CookieService } from 'ngx-cookie-service';
import { InterventionService } from 'src/app/services/intervention.service';
import { BicycleService } from 'src/app/services/bicycle.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { CompanyService } from 'src/app/services/company.service';

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
  cdr = inject(ChangeDetectorRef);
  formBuilder = inject(FormBuilder)
  public globalService = inject(GlobalService)
  cookieService = inject(CookieService)
  faGoogle = faGoogle
  faLinkedin = faLinkedin
  modelLogin: FormLoginModel = { email: "", password: "" };
  loginForm: FormGroup; 
  public error = {
    type: 'login'
  }
  public interventionService = inject(InterventionService)  
  registrationForm: FormGroup;
  addressValidated = false;
  @Input() isStepper = false;
  @Output() stepperAuthentication = new EventEmitter<boolean>();

  public bicycleService = inject(BicycleService)  

  public technicianService = inject(TechnicianService)  
  public companyService = inject(CompanyService)
    
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
    
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.minLength(2)]
    });

  }

  get loginControls() {
    return this.loginForm.controls;
  }

  get f() {
    return this.registrationForm.controls;
  }


  async onSubmitLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      const login$ = this.standardAuthService.loginStandard({...loginData,...this.companyService.subdomainREQ});
      const result = this.loaderService.showLoaderUntilCompleted(login$);
      result.subscribe(
        {
          next: () => {
            if(this.isStepper){
              this.stepperAuthentication.emit(true)
            }else{
              this.globalService.loadAllData(this.bicycleService,this.technicianService,this.interventionService);
              this.router.navigateByUrl("list-zones")
            }
          }, error: (err) => {
            this.displayError(err,'login')
            console.log("login error", err)
          }
        }
      )
    }

  }


  displayError(err: string, type?: 'login' | 'register') {
    if (type) {
      this.error.type = type
    }
    this.messageService.showMessage(err, Message.danger)
  }



  async onSubmitRegister() {
    if (this.registrationForm.valid && !(this.addressValidated && this.registrationForm.controls['address'].hasValidator(Validators.required))) {
      const register$ = this.standardAuthService.register(this.registrationForm.value);
      const result = this.loaderService.showLoaderUntilCompleted(register$);
      result.subscribe({
        next: (res) => {
          if(this.isStepper){
            this.stepperAuthentication.emit(true)
          }else{
            this.globalService.loadAllData(this.bicycleService,this.technicianService,this.interventionService);
            this.router.navigateByUrl("list-zones")
          }
        }, error: (err) => {
          this.displayError(err, 'register')
          console.log("register error", err)
        }
      })
    } else {
      this.messageService.showMessage('Veuillez sélectionner une adresse valide.', Message.danger);
    }
  }

  onGoogleLogin() {
    this.oauthService.loginOauth();
  }



  ionViewWillLeave() {
    this.messageService.clearMessage()
  }

  handleAddressChange(place: any) {
    if (place.geometry) {
      console.log(place);
      this.registrationForm.patchValue({ address: place.formatted_address });
      this.addressValidated = true;
    }
  }

}
