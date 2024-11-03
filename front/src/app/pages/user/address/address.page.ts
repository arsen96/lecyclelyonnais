import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
  standalone:true,
  imports: [MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, 
    
  ]
})
export class AddressPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  checkAddress(form){
    console.log("formee",form)
  }

}
