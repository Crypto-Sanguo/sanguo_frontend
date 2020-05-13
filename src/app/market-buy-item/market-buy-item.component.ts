import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';


@Component({
  selector: 'app-market-buy-item',
  templateUrl: './market-buy-item.component.html',
  styleUrls: ['./market-buy-item.component.css']
})
export class MarketBuyItemComponent implements OnInit {

  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onCloseAndRefresh: EventEmitter<any> = new EventEmitter();

  waiting: boolean = false;

  itemManager: any = null;

  itemData: Array<any> = [];

  selectedItemId: number = 0;
  price: number = 0;
  amountToBuy: number = 0;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.itemManager = new ItemManager(this.contractService.myIOST);

    for (let itemId in environment.itemData) {
      if (environment.itemData[itemId].isMountable) continue;

      this.itemData.push({
        itemId: itemId,
        nameCN: environment.itemData[itemId].nameCN,
        nameEN: environment.itemData[itemId].nameEN
      });
    }
  }

  close() {
    this.onClose.emit();
  }

  select() {
    if (!this.selectedItemId || !this.amountToBuy) {
      return;
    }

    this.waiting = true;

    this.contractService.buyItemInBatch(this.selectedItemId, this.price, this.amountToBuy).then(rIdArray => {
      this.itemManager.getMyItemsByRIdArray(rIdArray).then(items => {
        this.profile.items = this.profile.items.concat(items);
        this.profile.items.sort((a, b) => b.itemId - a.itemId);
      });

      this.waiting = false;

      this.onCloseAndRefresh.emit({
        isPurchase: true,
        boughtAmount: rIdArray.length
      });
    }, err => {
      this.waiting = false;
    });
  }
}
