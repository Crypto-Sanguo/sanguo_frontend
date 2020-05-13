import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';


@Component({
  selector: 'app-land-rent',
  templateUrl: './land-rent.component.html',
  styleUrls: ['./land-rent.component.css']
})
export class LandRentComponent implements OnInit {

  @Output() onCloseAndRent: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  duration: number = 15;
  price: number = 30;

  language: number = 0;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  work() {
    if (this.duration < 3 || this.duration > 100) {
      return;
    }

    if (this.price <= 0) {
      return;
    }

    this.onCloseAndRent.emit({
      duration: this.duration,
      price: this.price
    });
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}
