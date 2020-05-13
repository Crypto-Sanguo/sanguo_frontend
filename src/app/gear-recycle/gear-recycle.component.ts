import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-recycle',
  templateUrl: './gear-recycle.component.html',
  styleUrls: ['./gear-recycle.component.css']
})
export class GearRecycleComponent implements OnInit {

  @Input() itemId: number;
  @Input() itemWorth: number;

  @Output() onRecycle: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  itemNameCN: string = "";
  itemNameEN: string = "";

  waiting: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    
    this.itemNameCN = environment.itemData[this.itemId].nameCN;
    this.itemNameEN = environment.itemData[this.itemId].nameEN;
  }

  confirm() {
    this.onRecycle.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
