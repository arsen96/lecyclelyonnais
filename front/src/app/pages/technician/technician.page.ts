import { Component, ElementRef, inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonInputPasswordToggle } from '@ionic/angular';
import { LatLng } from 'leaflet';
import { Message, MessageService } from 'src/app/services/message.service';
import { TechnicianService } from 'src/app/services/technician.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.page.html',
  styleUrls: ['./technician.page.scss'],
})
export class TechnicianPage implements OnInit{
  technicianForm: FormGroup;
  displayError = false;
  showPassword = false; 
  technicianService: TechnicianService = inject(TechnicianService);
  public messageService = inject(MessageService)
  addressValidated = false;
  constructor(private fb: FormBuilder) { }

  ionViewWillEnter() {
    this.displayError = false;
  }


  ngOnInit() {
    this.technicianForm = this.fb.group({
      last_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]], 
      first_name: ['Kubtyan', [Validators.required, Validators.minLength(2)]], 
      email: ['kubatarsen@gmail.com', [Validators.required, Validators.email]], 
      password: ['Testtest96-', [Validators.required, Validators.minLength(8)]],
      phone: ['06 06 06 06 06', [Validators.required]],
      address: ['123 rue de la paix', [Validators.required, Validators.minLength(5)]], 
    });
  }



  generatePassword() {
    const newPassword = Math.random().toString(36).slice(-8);
    this.technicianForm.patchValue({ password: newPassword });
  }


    onSubmit() {
      if (this.technicianForm.valid) {
        if (!this.addressValidated) {
          this.messageService.showMessage('Veuillez sélectionner une adresse valide dans la liste des suggestions.', Message.danger);
          this.displayError = true;
        }else{
          this.displayError = false;
          this.technicianService.create(this.technicianForm.value).then((res) => {
          this.technicianForm.disable();
          this.messageService.showMessage(res.message, Message.success)
          this.displayError = true;
          setTimeout(() => {
            this.resetForm();
          }, 2000);
          // Add logic to handle form submission
        },(err) => {
          this.messageService.showMessage(err, Message.danger)
          this.displayError = true;
        })
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

  resetForm() {
    this.displayError = false;
    this.technicianForm.reset();
    this.technicianForm.enable();
    this.addressValidated = false;
  }
}
