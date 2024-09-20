import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent  implements OnInit {

  public loaderService = inject(LoadingService);
  constructor() { }

  ngOnInit() {}

}
