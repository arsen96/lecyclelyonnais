import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubdomainService {

  private allowedSubdomains = ['companyA', 'companyB'];

  getSubdomain(): string | null {
    const host = window.location.hostname; 
    const subdomain = host.split('.')[0];
    return subdomain !== 'localhost' ? subdomain : null;
  }

  isAllowedSubdomain(subdomain: string | null): boolean {
    return subdomain ? this.allowedSubdomains.includes(subdomain) : false;
  }
}
