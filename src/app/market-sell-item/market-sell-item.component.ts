import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-market-sell-item',
  templateUrl: './market-sell-item.component.html',
  styleUrls: ['./market-sell-item.component.css']
})
export class MarketSellItemComponent implements OnInit {

  @Input() profile: any;
  @Output() onCloseAndRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  itemArray = [];
  waiting = false;

  selectedItemRId:number = 0;
  price:number = 0;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.loadMyItems();
  }

  loadMyItems() {
    this.profile.items.map(item => {
      if (!item.forSale) {
        if (!this.selectedItemRId) this.selectedItemRId = item.rId;

        const itemNameCN = environment.itemData[item.itemId].nameCN;
        const itemNameEN = environment.itemData[item.itemId].nameEN;

        this.itemArray.push({
          rId: item.rId,
          level: item.level,
          score: item.score,
          nameCN: itemNameCN,
          nameEN: itemNameEN
        });
      }
    });
  }

  select() {
    if (!this.selectedItemRId) return;

    const priceInt = Math.ceil(this.price);

    if (priceInt <= 0) return;

    this.waiting = true;

    this.contractService.sellItemOffer(this.selectedItemRId, priceInt).then(_ => {
      this.profile.items.forEach(item => {
        if (item.rId == this.selectedItemRId) {
          item.forSale = 1;
        }
      });

      this.waiting = false;
      this.onCloseAndRefresh.emit();
    }, err => {
      this.waiting = false;
    });
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
