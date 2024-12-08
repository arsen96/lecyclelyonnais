import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Bicycle } from 'src/app/models/bicycle';
import { BicycleService } from 'src/app/services/bicycle.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-bike',
  templateUrl: './bike.page.html',
  styleUrls: ['./bike.page.scss'],
})
export class BikePage implements OnInit {
  bikeForm: FormGroup;
  public bicycleService: BicycleService = inject(BicycleService);
  public loadingService: LoadingService = inject(LoadingService);  
  public messageService: MessageService = inject(MessageService); 
  bikeSelected: Bicycle = null;
  actRoute = inject(ActivatedRoute);
  bikeId: number = null;

  constructor(private formBuilder: FormBuilder) {
    this.bikeId = Number(this.actRoute.snapshot.params['id']) ? Number(this.actRoute.snapshot.params['id']) : null;
  }

  ionViewDidEnter() {
    this.loadingService.showLoaderUntilCompleted(this.bicycleService.getUserBicycles()).subscribe((res: any) => {
      if (this.bikeId) {
        this.bikeSelected = res.find((bike: Bicycle) => bike.id === this.bikeId);
        if (this.bikeSelected) {
          this.bikeForm.patchValue(this.bikeSelected);
        }
      }
    });
  }

  ngOnInit() {
    this.bikeForm = this.formBuilder.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      type: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.bikeForm.valid) {
      const action = this.bikeSelected ? this.bicycleService.updateBicycle(this.bikeId, this.bikeForm.value) : this.bicycleService.addNew(this.bikeForm.value);
      this.loadingService.showLoaderUntilCompleted(action).subscribe({
        next: (res) => { 
          console.log('Form Submitted', res);
          this.messageService.showToast('Bike saved successfully', 'success');
          if(!this.bikeSelected) {
            this.bikeForm.reset();
          } 
        },
        error: (error) => {
          this.messageService.showToast(error.message, 'danger'); 
        }
      });
    } else {
      this.messageService.showToast('Veuillez remplir tous les champs', 'danger'); 
    }
  }

  ionViewWillLeave() {
    this.messageService.hideMessage()
  }
}
