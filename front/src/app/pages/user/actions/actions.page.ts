import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';
import { GlobalService } from 'src/app/services/global.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.page.html',
  styleUrls: ['./actions.page.scss'],
})
export class ActionsPage implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  addressFormGroup: FormGroup;
  detailsFormGroup: FormGroup;
  operationFormGroup: FormGroup;
  maintenanceFormGroup: FormGroup;
  repairFormGroup: FormGroup;
  isAuthenticated: boolean;
  minDate: string;
  addressFormCompleted: boolean = false;
  detailsFormCompleted: boolean = false;
  operationFormCompleted: boolean = false;
  maintenanceFormCompleted: boolean = false;
  repairFormCompleted: boolean = false;

  constructor(private _formBuilder: FormBuilder, public authService: AuthBaseService, public msgService: MessageService,public globalService:GlobalService) { }

  ionViewWillEnter() {
  
  }

  ngOnInit() {
    this.isAuthenticated = this.globalService.isAuthenticated.getValue() === true;
    this.minDate = new Date().toISOString().split('T')[0]; 
    const currentDateTime = new Date().toISOString();
    console.log("this.authService.user",this.isAuthenticated)
    const adresse = this.globalService.user.getValue()?.address;
 
    this.addressFormGroup = this._formBuilder.group({
      address: [adresse || '', Validators.required]
    });
    this.detailsFormGroup = this._formBuilder.group({
      brand: ['BRAND', Validators.required],
      model: ['sqs', Validators.required],
      year: ['2024', [Validators.required, Validators.pattern('^[0-9]{4}$')]], 
      type: ['', Validators.required]
    });
    this.operationFormGroup = this._formBuilder.group({
      operation: ['maintenance', Validators.required]
    });
    this.maintenanceFormGroup = this._formBuilder.group({
      package: ['', Validators.required],
      schedule: [currentDateTime, Validators.required], 
      photos: ['']
    });
    this.repairFormGroup = this._formBuilder.group({
      issueDetails: ['', Validators.required],
      schedule: [currentDateTime, Validators.required], 
      photos: ['']
    });

    // if (this.isAuthenticated) {
    //   setTimeout(() => {
    //     this.stepper.selectedIndex = 1;
    //   });
    // }
  }

  onAddressSubmit() {
    if (this.addressFormGroup.valid) {
      const addressData = this.addressFormGroup.value;
      console.log('Address Data:', addressData);
      this.addressFormCompleted = true;
      this.stepper.next();
    }
  }

  onDetailsSubmit() {
    if (this.detailsFormGroup.valid) {
      const detailsData = this.detailsFormGroup.value;
      console.log('Details Data:', detailsData);
      this.detailsFormCompleted = true;
      this.stepper.next();
    }
  }

  onOperationSubmit() {
    if (this.operationFormGroup.valid) {
      const operationData = this.operationFormGroup.value;
      console.log('Operation Data:', operationData);
      this.operationFormCompleted = true;
      this.stepper.next();
    }
  }

  onMaintenanceSubmit() {
    if (this.maintenanceFormGroup.valid) {
      const maintenanceData = this.maintenanceFormGroup.value;
      console.log('Maintenance Data:', maintenanceData);
      this.maintenanceFormCompleted = true;
      this.stepper.next();
    }
  }

  onRepairSubmit() {
    if (this.repairFormGroup.valid) {
      const repairData = this.repairFormGroup.value;
      console.log('Repair Data:', repairData);
      this.repairFormCompleted = true;
      this.stepper.next();
    }
  }

  handleFileInput(event) {
    console.log(event.target.files);
  }

  onDateTimeChange(event) {
    const selectedDate = new Date(event.detail.value);
    console.log('Selected Date and Time:', selectedDate);
  }

  onSubmit() {
    console.log('Form submitted');
    const allData = {
      address: this.addressFormGroup.value,
      details: this.detailsFormGroup.value,
      operation: this.operationFormGroup.value,
      maintenance: this.maintenanceFormGroup.value,
      repair: this.repairFormGroup.value
    }

    console.log("allData",allData)
  }
}
