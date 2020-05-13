import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-cooldown',
  templateUrl: './gear-cooldown.component.html',
  styleUrls: ['./gear-cooldown.component.css']
})
export class GearCooldownComponent implements OnInit {

  @Input() item: any;

  @Output() onPay: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  clearCost: number = 0;

  waiting: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.clearCost = Math.floor(this.item.worth / 2);

    this.language = parseInt(localStorage.getItem('language'));
  }

  confirm() {
    this.onPay.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
