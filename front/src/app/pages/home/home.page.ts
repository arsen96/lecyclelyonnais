import { Component, inject, Inject, OnInit } from '@angular/core';
import { AuthBaseService } from 'src/app/services/auth/auth-base.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public authService = inject(AuthBaseService)
  constructor() { }

  ngOnInit() {
    this.authService.test();
  }

}
