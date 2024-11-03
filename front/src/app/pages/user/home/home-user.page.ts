import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';
import { AddressPage } from '../address/address.page';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.page.html',
  styleUrls: ['./home-user.page.scss'],
  standalone:true,
  imports: [MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    AddressPage
  ],
})
export class HomeUserPage implements OnInit {

  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  ngOnInit(): void {
      
  }

}
