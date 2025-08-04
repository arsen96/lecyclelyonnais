import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'src/app/models/company';
import { CompanyService } from 'src/app/services/company.service';
import { GlobalService, UserRole } from 'src/app/services/global.service';
import { MessageService, Message } from 'src/app/services/message.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  companyForm: FormGroup;
  companySelected = null;
  companyId: number = null;
  public globalService = inject(GlobalService)

  public get UserRole(){
    return UserRole;
  }

  constructor(private fb: FormBuilder, private companyService: CompanyService, private actRoute: ActivatedRoute, private router: Router, public messageService: MessageService) {
    this.companyId = Number(this.actRoute.snapshot.params['id']) ? Number(this.actRoute.snapshot.params['id']) : null;
  }

  ngOnInit() {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subdomain: ['', [Validators.required]],
      theme_color: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });

    if (this.companyId) {
      this.companySelected = this.companyService.getCompanyById(this.companyId);
      if (this.companySelected) {
        this.companyForm.patchValue(this.companySelected);
      }
    }


    console.log("this.companies",this.companyService.companies)
  }

  /**
   * Gère la soumission du formulaire (création/mise à jour d'entreprise)
   */
  onSubmit() {
    if (this.companyForm.valid) {
      if (this.companySelected) {
        // Mode édition
        this.companyService.update({ id: this.companyId, ...this.companyForm.value }).then((res) => {
          this.messageService.showMessage('Entreprise mise à jour avec succès', Message.success);
          this.companyService.companies = new Array<Company>(); 
          if(this.globalService.userRole.getValue() !== UserRole.ADMIN){
            this.router.navigate(['/company-list']);
          }else{
             this.companyService.get();
          }
        }).catch((err) => {
          console.log("err",err)
          this.messageService.showMessage(err, Message.danger);
        });
      } else {
        // Mode création
        this.companyService.create(this.companyForm.value).then((res) => {
          this.companyService.companies = new Array<Company>(); 
          this.router.navigate(['/company-list']);
        }).catch((err) => {
          console.log("err",err)
          this.messageService.showMessage(err, Message.danger);
        });
      }
    }
  }


  ionViewWillLeave(){
    this.messageService.clearMessage();
  }
}
