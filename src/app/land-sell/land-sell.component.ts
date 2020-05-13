import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-land-sell',
  templateUrl: './land-sell.component.html',
  styleUrls: ['./land-sell.component.css']
})
export class LandSellComponent implements OnInit {

  @Output() onCloseAndSell: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  price: number = 2000;

  language: number = 0;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
  }

  work() {
    if (this.price <= 0) {
      return;
    }

    this.onCloseAndSell.emit({
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
