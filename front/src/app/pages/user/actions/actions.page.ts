import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';
import { GlobalService } from 'src/app/services/global.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { ZoneService } from 'src/app/services/zone.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InterventionService } from 'src/app/services/intervention.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { Technician } from 'src/app/models/technicians';
import { BicycleService } from 'src/app/services/bicycle.service';
import { Bicycle } from 'src/app/models/bicycle';
import { lastValueFrom } from 'rxjs';
import { Zones } from 'src/app/models/zones';

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
  isAtConfirmationStep: boolean = false;
  userBicycles: Bicycle[] = [];
  selectedBicycle: Bicycle;
  constructor(private _formBuilder: FormBuilder,public cd:ChangeDetectorRef,public technicianService:TechnicianService,public interventionService:InterventionService, public zoneService:ZoneService,public loadingService:LoadingService, public authService: AuthBaseService, public msgService: MessageService,public globalService:GlobalService, private bicycleService: BicycleService) { }
  displayError = false
  concernedZoneId:number;
  concernedZone:Zones ;
  availableTimeSlots: { time: string, available: boolean }[] = [];
  previousTimeSlot: string;
  selectedTimeSlotDate: string;
  techniciansByZone:Technician[] = [];
  interventionFinalData:any;
  availableDates: Date[] = [];
  ngOnInit() {
    this.concernedZoneId = null;
    this.addressValidated = false
    this.minDate = new Date().toISOString().split('T')[0]; 
    const currentDateTime = new Date().toISOString();
    const adresse = this.globalService.user.getValue()?.address;
    if(adresse){
      this.addressValidated = true
    }
    
    this.addressFormGroup = this._formBuilder.group({
      address: [adresse || '', Validators.required]
    });
    this.detailsFormGroup = this._formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      type: ['', Validators.required]
    });
    this.operationFormGroup = this._formBuilder.group({
      operation: ['maintenance', Validators.required]
    });
    this.maintenanceFormGroup = this._formBuilder.group({
      package: ['', Validators.required],
      scheduleDate: [currentDateTime, Validators.required],
      scheduleTime: ['', Validators.required],
      photos:  new FormArray([])
    });
    this.repairFormGroup = this._formBuilder.group({
      issueDetails: ['', Validators.required],
      scheduleDate: [currentDateTime, Validators.required],
      scheduleTime: ['', Validators.required],
      photos:  new FormArray([])
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
    lastValueFrom(this.bicycleService.getUserBicycles()).then((res:any) => {
      this.userBicycles = res;

    })

  }

  updateAvailableDates() {
    const operationType = this.operationFormGroup.value.operation;
    const availableDays = JSON.parse(this.concernedZone.model_planification[operationType].available_days);
    this.availableDates = this.getAvailableDates(availableDays);
  }

  getAvailableDates(availableDays: any): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Check for the next 30 days
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        if (availableDays[dayName]) {
            dates.push(date);
        }
    }
    return dates;
  }

  isDateEnabled(dateIsoString: string): boolean {
    if(!this.concernedZone ){
      return false
    }
    const date = new Date(dateIsoString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const operationType = this.operationFormGroup.value.operation === 'maintenance' ? 'maintenance' : 'repair';
    const operationPlanification = this.concernedZone.model_planification[operationType]
    const availableDays = JSON.parse(operationPlanification.available_days);
    if(!availableDays){
      return false;
    }
    return availableDays[dayName]
  }

  onBicycleSelect(bicycle: Bicycle) {
    this.selectedBicycle = bicycle;
    this.detailsFormGroup.patchValue({
      brand: bicycle.brand,
      model: bicycle.model,
      year: bicycle.year,
      type: bicycle.type
    });
  }

  async onAddressSubmit() {
      if (this.addressFormGroup.valid) {
        if (this.addressValidated) {
          const addressData = this.addressFormGroup.value;
          try {
          const inZone$ = this.zoneService.isAddressInZone(addressData.address);
          const result = this.loadingService.showLoaderUntilCompleted(inZone$);
          result.subscribe({
            next: (result: any) => {
              this.addressFormCompleted = true;
              if (result.success) {
                this.concernedZoneId = result.success;
                this.zoneService.get().then(() => {
                  this.concernedZone = this.zoneService.getZoneById(this.concernedZoneId);
                  this.updateAvailableDates();
                });
                this.technicianService.get().then((technicians: Technician[]) => {
                  this.techniciansByZone = technicians.filter(technician => technician.geographical_zone_id === this.concernedZoneId);
                });
                this.displayError = false;
                this.stepper.next();
              } else {
                this.displayError = true;
                this.msgService.showMessage(result.message, Message.danger);
              }
            },
            error: (error: any) => {
              this.displayError = true;
              this.msgService.showMessage(error, Message.danger);
            }
          });
        } catch (error) {
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
      this.detailsFormCompleted = true;
      this.stepper.next();
    }
  }

  onOperationSubmit() {
    if (this.operationFormGroup.valid) {
      const operationData = this.operationFormGroup.value;
      this.operationFormCompleted = true;
      this.stepper.next();
    }
  }



  handleFileInput(event) {
    const files: FileList = event.target.files;
    let photosArray: FormArray;
    if(this.operationFormGroup.get('operation').value === 'maintenance'){
      photosArray = this.maintenanceFormGroup.get('photos') as FormArray;
      (this.repairFormGroup.get('photos') as FormArray).clear();
    }else{
      photosArray = this.repairFormGroup.get('photos') as FormArray;
      (this.maintenanceFormGroup.get('photos') as FormArray).clear();
    }
    photosArray.clear(); 

    for (let i = 0; i < files.length; i++) {
        photosArray.push(this._formBuilder.control(files[i]));
    }

    photosArray.updateValueAndValidity();
    event.target.value = '';
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
    
    
    const allData = {
      address: {zone:this.concernedZoneId,...this.addressFormGroup.value},
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
    const formData = new FormData();
    formData.append('intervention', JSON.stringify(this.interventionFinalData));
    this.maintenanceFormGroup.get('photos').value.forEach(photo => {
      formData.append('photos', photo);
    });
    const intervention$ = this.interventionService.create(formData);
    this.loadingService.showLoaderUntilCompleted(intervention$).subscribe({
    next: (res: any) => {
      this.interventionService.interventionLoad();
      this.interventionService.allInterventions = [];
      this.technicianService.getTechniciansByZone(this.concernedZoneId);
      this.bicycleService.resetBicyclesLoaded();
      this.bicycleService.get().subscribe();
      this.interventionService.get();

      this.technicianService.resetTechniciansLoaded();
      this.stepper.next();
    },
    error: (error: any) => {
      this.msgService.showToast(error,Message.danger)
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
      this.displayError = true;
      this.msgService.showMessage("Veuillez valider votre adresse avant de continuer.", Message.danger);
    }

    // Check if the user is at the confirmation step

  }

  preventBackNavigation(event: any) {
    if ((this.isAtConfirmationStep && event.previouslySelectedIndex > event.selectedIndex) || ((this.addressValidated === false || this.displayError === true) && event.selectedIndex > 0)) {
      // Prevent going back from the confirmation step
      setTimeout(() => {
        this.cd.detectChanges();
        this.stepper.selectedIndex = event.previouslySelectedIndex;
        this.cd.detectChanges();
      },0);
    }

    this.isAtConfirmationStep = event.selectedIndex === this.stepper.steps.length - 1;
  }

  changeAddressValidated(){
    this.addressValidated = false
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    const operationType = this.operationFormGroup.value.operation === 'maintenance' ? 'maintenance' : 'repair';
    this.availableTimeSlots = this.generateTimeSlots(selectedDate, operationType);
    const isAnySlotAvailable = this.availableTimeSlots.some(slot => slot.available);
    if (!isAnySlotAvailable) {
        this.msgService.showToast('Aucun créneau horaire disponible pour la date sélectionnée.', 'danger');
    }
  }

  generateTimeSlots(date: Date, operationType: string): { time: string, available: boolean }[] {
    const planification = this.concernedZone.model_planification[operationType];
    const [startHour, startMinute] = planification.start_time.split(':').map(Number);
    const [endHour, endMinute] = planification.end_time.split(':').map(Number);
    const [intervalHours, intervalMinutes] = planification.slot_duration.split(':').map(Number);
    const interval = intervalHours + intervalMinutes / 60;
    
    const slots: { time: string, available: boolean }[] = [];

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const slotStart = new Date(date);
        slotStart.setHours(currentHour, currentMinute, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + interval * 60);

        if (slotEnd.getHours() > endHour || (slotEnd.getHours() === endHour && slotEnd.getMinutes() > endMinute)) {
            break;
        }

        const timeString = `${slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${slotEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        const isAvailable = this.isDateAvailable(slotStart, slotEnd);
        slots.push({ time: timeString, available: isAvailable });

        currentHour = slotEnd.getHours();
        currentMinute = slotEnd.getMinutes();
    }

    return slots;
  }

  /**
   * Keep only those that overlap with the requested time slot ()
   * @param slotStart Date
   * @param slotEnd Date
   * @returns true  if at least ont technician is available
   */
  isDateAvailable(slotStart: Date, slotEnd: Date): boolean {
    let isAvailable = true;
    let interventions = this.interventionService.allInterventions.filter(intervention => {
        const appointmentStart = new Date(intervention.appointment_start);
        const appointmentEnd = new Date(intervention.appointment_end);
        return (slotStart < appointmentEnd && slotEnd > appointmentStart) && intervention.status == '';
    });
    if (interventions.length > 0) {
      const technicians = interventions.map(intervention => this.technicianService.getTechnicianById(intervention.technician.id));
      isAvailable = !(this.techniciansByZone.length === technicians.length);
    }

    return isAvailable;
  }

  onTimeSlotSelect(event: any) {
    const selectedTimeSlot = event.detail.value;
    
    const [startTime, endTime] = selectedTimeSlot.split(' - ');
    const selectedDate = new Date(this.maintenanceFormGroup.value.scheduleDate);
    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    startDateTime.setHours(startHour, startMinute);

    // Combine the selected date with the end time
    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    endDateTime.setHours(endHour, endMinute);

    if (!this.isDateAvailable(startDateTime, endDateTime)) {
        this.msgService.showToast('Le créneau horaire sélectionné est déjà pris.', 'danger');
        // Revert to the previous valid time slot
        this.maintenanceFormGroup.patchValue({ scheduleTime: this.previousTimeSlot });
    } else {
        // Update the previous time slot
        this.previousTimeSlot = selectedTimeSlot;
        this.selectedTimeSlotDate = this.maintenanceFormGroup.value.scheduleDate
    }
  }


  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      const loginData = this.loginFormGroup.value;
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
    this.concernedZoneId = null;
    this.techniciansByZone = [];
    this.availableTimeSlots = [];
    this.previousTimeSlot = '';
    this.selectedTimeSlotDate = '';
    this.stepper.reset();
  }
}
