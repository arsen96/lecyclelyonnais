import { Component, ElementRef, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, IonInputPasswordToggle } from '@ionic/angular';
import { LatLng } from 'leaflet';
import { Message, MessageService } from 'src/app/services/message.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { ZoneService } from 'src/app/services/zone.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.page.html',
  styleUrls: ['./technician.page.scss'],
})
export class TechnicianPage implements OnInit{
  technicianForm: FormGroup;
  displayMsg = false;
  showPassword = false; 
  technicianService: TechnicianService = inject(TechnicianService);
  messageService = inject(MessageService)
  addressValidated = false;
  technicianSelected = null;
  actRoute = inject(ActivatedRoute);
  technicianId:number = null;
  constructor(private fb: FormBuilder,public zoneService: ZoneService) {
    this.technicianId = Number(this.actRoute.snapshot.params['id']) ? Number(this.actRoute.snapshot.params['id']) : null;
   }

  ionViewWillEnter() {
    this.displayMsg = false;

  }


  ngOnInit() {
    this.manageForm();
  }

  async manageForm(){
    await this.technicianService.get();
    this.technicianForm = this.fb.group({
      last_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]], 
      first_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]], 
      email: ['kubatarsen@gmail.com', [Validators.required, Validators.email]], 
      password: ['', [
        control => {
          if (!this.technicianSelected && (!control.value || control.value.length < 8)) {
            return { required: true, minlength: true };
          }
          if (control.value && control.value.length > 0 && control.value.length < 8) {
            return { minlength: true };
          }
          return null;
        }
      ]],
      phone: ['06 06 06 06 06', [Validators.required]],
      address: ['', []], 
    });

    if(this.technicianId){
      this.technicianSelected = this.technicianService.technicians.find(technician => technician.id === this.technicianId);
      if(this.technicianSelected){
        const { password, ...technicianData } = this.technicianSelected;
        this.technicianForm.patchValue(technicianData);
        this.addressValidated = true;
      }
    }


 
  }



  generatePassword() {
    const newPassword = Math.random().toString(36).slice(-8);
    this.technicianForm.patchValue({ password: newPassword });
  }


    onSubmit() {
      if (this.technicianForm.valid) {
        if (!this.addressValidated && this.technicianForm.value.address.length > 0) {
          this.messageService.showMessage('Veuillez sélectionner une adresse valide dans la liste des suggestions.', Message.danger);
        }else{

          const postFormData = (message:string) => {
            if(message) {
              this.messageService.showMessage(message, Message.success)
            }
            this.displayMsg = true;
            this.technicianService.technicians = new Array();
            this.zoneService.allZones = new Array();
            if(!this.technicianSelected){
              this.technicianForm.disable();
              setTimeout(() => {
                this.resetForm();
              }, 2000);
            }
          }

          if(this.technicianSelected){  
            this.technicianService.update({id: this.technicianId, ...this.technicianForm.value}).then((res) => {
              postFormData(res?.message)
            },(err) => {
              console.log("errerrerr", err)
              this.messageService.showMessage(err, Message.danger)
              this.displayMsg = true;
            })
          }else{
            this.technicianService.create(this.technicianForm.value).then((res) => {
              postFormData(res?.message)
            },(err) => {
              this.messageService.showMessage(err, Message.danger)
              this.displayMsg = true;
            })
          }
 
      }
    }
  }

  handleAddressChange(place: any) {
      if (place.geometry) {
        console.log(place);
        this.technicianForm.patchValue({ address: place.formatted_address });
        this.addressValidated = true;
    }
  }

  ionViewWillLeave() {
    this.messageService.clearMessage()
  }

  resetForm() {
    this.messageService.clearMessage()
    this.technicianForm.reset();
    this.technicianForm.enable();
    this.addressValidated = false;
  }
}
