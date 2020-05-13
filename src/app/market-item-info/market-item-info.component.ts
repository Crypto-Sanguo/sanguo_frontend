import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';

@Component({
  selector: 'app-market-item-info',
  templateUrl: './market-item-info.component.html',
  styleUrls: ['./market-item-info.component.css']
})
export class MarketItemInfoComponent implements OnInit {

  @Input() itemRId: number;
  @Input() seller: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  descriptionCN: string = '';
  descriptionEN: string = '';

  nameCN: string = '';
  nameEN: string = '';

  itemManager: any = null;
  item: any = null;

  waiting: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.itemManager = new ItemManager(this.contractService.myIOST);

    this.waiting = true;

    if (!this.seller) {
      this.seller = this.contractService.getUserAddress();
    }

    this.itemManager.getOneItemOf(this.itemRId, this.seller).then(item => {
      this.item = item;

      this.nameCN = environment.itemData[item.itemId].nameCN;
      this.nameEN = environment.itemData[item.itemId].nameEN;

      this.waiting = false;
    });
  }

  getUnitName(unitId: number) {
    return [environment.unitData[unitId].nameCN, environment.unitData[unitId].nameEN];
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
