import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';
import { GlobalService } from 'src/app/services/global.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { ZoneService } from 'src/app/services/zone.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { Technician } from 'src/app/models/technicians';

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
  minDate: string;
  addressFormCompleted: boolean = false;
  detailsFormCompleted: boolean = false;
  operationFormCompleted: boolean = false;
  addressValidated = false
  loginFormGroup: FormGroup;
  constructor(private _formBuilder: FormBuilder,public cd:ChangeDetectorRef,public technicianService:TechnicianService,public interventionService:InterventionService, public zoneService:ZoneService,public loadingService:LoadingService, public authService: AuthBaseService, public msgService: MessageService,public globalService:GlobalService) { }
  displayError = false
  concernedZone:number;
  availableTimeSlots: { time: string, available: boolean }[] = [];
  previousTimeSlot: string;
  selectedTimeSlotDate: string;
  techniciansByZone:Technician[] = [];
  interventionFinalData:any;
  ngOnInit() {
    this.concernedZone = null;
    this.addressValidated = false
    this.minDate = new Date().toISOString().split('T')[0]; 
    const currentDateTime = new Date().toISOString();
    const adresse = this.globalService.user.getValue()?.address;
    if(adresse){
      this.addressValidated = true
    }
    console.log(" this.addressValidated", this.addressValidated)

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
      scheduleDate: [currentDateTime, Validators.required],
      scheduleTime: ['', Validators.required],
      photos: ['']
    });
    this.repairFormGroup = this._formBuilder.group({
      issueDetails: ['', Validators.required],
      scheduleDate: [currentDateTime, Validators.required],
      scheduleTime: ['', Validators.required],
      photos: ['']
    });
    this.previousTimeSlot = '';
    this.selectedTimeSlotDate = this.maintenanceFormGroup.value.scheduleDate;
    this.loginFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    // if (this.isAuthenticated) {
    //   setTimeout(() => {
    //     this.stepper.selectedIndex = 1;
    //   });
    // }
  }

  async onAddressSubmit() {
      if (this.addressFormGroup.valid) {
        if (this.addressValidated) {
          const addressData = this.addressFormGroup.value;
          console.log('Address Data:', addressData);
          try {
          const inZone$ = this.zoneService.isAddressInZone(addressData.address);
          const result = this.loadingService.showLoaderUntilCompleted(inZone$);
          result.subscribe((result: any) => {
            console.log("result",result)
            this.addressFormCompleted = true;
            if (result.success) { 
              this.concernedZone = result.success;
              this.technicianService.get().then((technicians: Technician[]) => {
                this.techniciansByZone = technicians.filter(technician => technician.geographical_zone_id === this.concernedZone);
              })
              this.displayError = false;
              this.stepper.next();
            } else {
              this.displayError = true;
              this.msgService.showMessage(result.message, Message.danger);
            }
          });
        } catch (error) {
          console.log("error", error);
        }
      }else {
        this.displayError = true;
        this.msgService.showMessage("Veuillez saisir une adresse valide", Message.danger);
        this.addressFormGroup.setErrors({ invalidAddress: true });
      }
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



  handleFileInput(event) {
    console.log(event.target.files);
  }

  onDateTimeChange(event: any) {
    const selectedDateTime = new Date(event.detail.value);
    if (!this.isTimeAvailable(selectedDateTime)) {
      // Display an error message or handle the unavailable time
      console.error('Selected time is not available');
    }
  }

  isTimeAvailable(dateTime: Date): boolean {
    // Define your logic to check if the time is available
    const unavailableHours = [12, 13, 14]; // Example: Unavailable from 12 PM to 2 PM
    const hour = dateTime.getHours();
    return !unavailableHours.includes(hour);
  }

  handleAddressChange(place: any) {
    if (place.geometry) {
      console.log(place);
      this.addressFormGroup.patchValue({ address: place.formatted_address });
      this.addressValidated = true;
  }
}

  onSubmit() {
    console.log('Maintenance Form Valid:', this.maintenanceFormGroup.valid);
    console.log('Repair Form Valid:', this.repairFormGroup.valid);
    console.log('Maintenance Form Errors:', this.maintenanceFormGroup.errors);
    console.log('Repair Form Errors:', this.repairFormGroup.errors);
    
    console.log("isValid", !this.maintenanceFormGroup.valid)
    if ((this.operationFormGroup.get('operation').value === 'maintenance' && !this.maintenanceFormGroup.valid) || (this.operationFormGroup.get('operation').value === 'reparation' && !this.repairFormGroup.valid)) {
      console.error('Form is invalid');
      return;
    }
    this.maintenanceFormGroup.value.scheduleDate = this.selectedTimeSlotDate
    this.maintenanceFormGroup.value.scheduleDate = this.maintenanceFormGroup.value.scheduleDate?.split('T')[0];
    this.repairFormGroup.value.scheduleDate = this.repairFormGroup.value.scheduleDate?.split('T')[0];
    this.maintenanceFormGroup.value.scheduleTimeStart = this.maintenanceFormGroup.value.scheduleDate + "T" + this.maintenanceFormGroup.value.scheduleTime?.split('-')[0]?.trim() + ":00Z";
    this.maintenanceFormGroup.value.scheduleTimeEnd = this.maintenanceFormGroup.value.scheduleDate + "T" + this.maintenanceFormGroup.value.scheduleTime?.split('-')[1]?.trim() + ":00Z"; 
    this.repairFormGroup.value.scheduleTimeStart = this.repairFormGroup.value.scheduleDate + "T" + this.repairFormGroup.value.scheduleTime?.split('-')[0]?.trim() + ":00Z";
    this.repairFormGroup.value.scheduleTimeEnd = this.repairFormGroup.value.scheduleDate + "T" + this.repairFormGroup.value.scheduleTime?.split('-')[1]?.trim() + ":00Z";
    
    console.log('Form submitted');
    const allData = {
      address: {zone:this.concernedZone,...this.addressFormGroup.value},
      details: this.detailsFormGroup.value,
      operation: this.operationFormGroup.value,
      maintenance: this.maintenanceFormGroup.value,
      repair: this.repairFormGroup.value,
      userId:this.globalService.user.getValue()?.id
    }

    this.interventionFinalData = allData
    if(this.globalService.isAuthenticated.getValue() === true){
      this.createNewIntervention()
    }else{
      this.stepper.next();
    }
  }

  createNewIntervention(){
    const intervention$ = this.interventionService.save(this.interventionFinalData);
    this.loadingService.showLoaderUntilCompleted(intervention$).subscribe({
    next: (res: any) => {
      this.interventionService.allInterventions = [];
      this.interventionService.getAll();
      this.stepper.next();
    },
    error: (error: any) => {
      console.log("error",error);
    }
    }); 
  }

  onStepChange(event: any) {
    if (event.selectedIndex > 0 && (!this.addressFormGroup.valid || !this.addressFormCompleted || !this.addressValidated)) {
      setTimeout(() => {
        this.stepper.selectedIndex = 0;
        this.cd.detectChanges();
      });
      this.displayError = true
      this.msgService.showMessage("Veuillez valider votre adresse avant de continuer.", Message.danger);
    }
  }

  changeAddressValidated(){
    this.addressValidated = false
    console.log("this.addressValidated",this.addressValidated)
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    const operationType = this.operationFormGroup.value.operation;
    // 
    console.log("operationType", operationType)
    console.log("selectedDate", selectedDate)
    this.availableTimeSlots = this.generateTimeSlots(selectedDate, operationType);
    console.log("this.availableTimeSlots", this.availableTimeSlots);

    // Check if any time slot is available
    const isAnySlotAvailable = this.availableTimeSlots.some(slot => slot.available);
    if (!isAnySlotAvailable) {
        this.msgService.showToast('Aucun créneau horaire disponible pour la date sélectionnée.', 'danger');
    }
  }

  generateTimeSlots(date: Date, operationType: string): { time: string, available: boolean }[] {
    const startHour = 9;
    const endHour = 17.5;
    let interval = 1.5; 

    if (operationType === 'reparation') {
      interval = 3; 
    }

    const slots: { time: string, available: boolean }[] = [];

    for (let hour = startHour; hour < endHour; hour += interval) {
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(hour), (hour % 1) * 60, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + interval * 60);

      const timeString = `${slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      const isAvailable = this.isDateAvailable(slotStart, slotEnd);
      if(timeString.startsWith("16:30")){
        console.log("slotStart", slotStart)
        console.log("slotStart", slotStart)
        console.log("timeString", timeString)
        console.log("isAvailable", isAvailable)
        console.log("this.interventionService.allInterventions", this.interventionService.allInterventions)
      }
      // console.log("slotStart", slotStart)
      // console.log("slotEnd", slotEnd)
      slots.push({ time: timeString, available: isAvailable });
    }

    return slots;
  }

  isDateAvailable(slotStart: Date, slotEnd: Date): boolean {
    console.log("this.interventionService.allInterventions", this.interventionService.allInterventions)
    console.log("this.techniciansByZone", this.techniciansByZone)
    let isAvailable = true;
    const interventions = this.interventionService.allInterventions.filter(intervention => {
        const appointmentStart = new Date(intervention.appointment_start);
        const appointmentEnd = new Date(intervention.appointment_end);
        return (slotStart < appointmentEnd && slotEnd > appointmentStart);
    });

    if(interventions.length > 0){
      const technicians = interventions.map(intervention => this.technicianService.getTechnicianById(intervention.technician_id));
      isAvailable = !(this.techniciansByZone.length === technicians.length);
    }
    return isAvailable;
  }

  onTimeSlotSelect(event: any) {
    const selectedTimeSlot = event.detail.value;
    
    const [startTime, endTime] = selectedTimeSlot.split(' - ');
    console.log("selectedTimeSlot", selectedTimeSlot)
    // Get the selected date from the form control
    const selectedDate = new Date(this.maintenanceFormGroup.value.scheduleDate);
    console.log("selectedDate", selectedDate)
    // Combine the selected date with the start time
    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute);

    // Combine the selected date with the end time
    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute);

    console.log("startDateTime", startDateTime.toString());
    console.log("endDateTime", endDateTime.toString());

    if (!this.isDateAvailable(startDateTime, endDateTime)) {
        this.msgService.showToast('Le créneau horaire sélectionné est déjà pris.', 'danger');
        // Revert to the previous valid time slot
        this.maintenanceFormGroup.patchValue({ scheduleTime: this.previousTimeSlot });
    } else {
        // Update the previous time slot to the current valid selection
        this.previousTimeSlot = selectedTimeSlot;
        this.selectedTimeSlotDate = this.maintenanceFormGroup.value.scheduleDate
        // this.maintenanceFormGroup.patchValue({ scheduleTime: this.previousTimeSlot });
    }
  }


  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      const loginData = this.loginFormGroup.value;
      console.log('Login Data:', loginData);
      this.stepper.next();
    }
  }

  onAuthenticated(event: any) {
    this.stepper.next();
    this.createNewIntervention()
  }

  resetForm() {
    this.detailsFormGroup.reset();
    this.operationFormGroup.reset();
    this.maintenanceFormGroup.reset();
    this.repairFormGroup.reset();
    this.loginFormGroup.reset();
    this.addressFormCompleted = false;
    this.detailsFormCompleted = false;
    this.operationFormCompleted = false;
    this.addressValidated = false;
    this.concernedZone = null;
    this.techniciansByZone = [];
    this.availableTimeSlots = [];
    this.previousTimeSlot = '';
    this.selectedTimeSlotDate = '';
    this.stepper.reset();
  }
}
