import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-market-filter',
  templateUrl: './market-filter.component.html',
  styleUrls: ['./market-filter.component.css']
})
export class MarketFilterComponent implements OnInit {

  @Input() isUnit: number;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  unitData: Array<any> = [];
  itemData: Array<any> = [];
  unitId: number = 0;
  itemId: number = 0;
  isOnlyMe: number = 0;
  sortByPrice: number = -1;

  constructor() { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    for (let unitId in environment.unitData) {
      if (!environment.unitData[unitId].nameCN) continue;

      this.unitData.push({
        unitId: unitId,
        nameCN: environment.unitData[unitId].nameCN,
        nameEN: environment.unitData[unitId].nameEN
      });
    }

    for (let itemId in environment.itemData) {
      this.itemData.push({
        itemId: itemId,
        nameCN: environment.itemData[itemId].nameCN,
        nameEN: environment.itemData[itemId].nameEN
      });
    }
  }

  onlyMe() {
    this.isOnlyMe = this.isOnlyMe ? 0 : 1;
  }

  search() {
    this.onSearch.emit({
      unitId: this.unitId,
      itemId: this.itemId,
      isOnlyMe: this.isOnlyMe,
      sortByPrice: this.sortByPrice
    });

    this.unitId = 0;
    this.itemId = 0;
    this.isOnlyMe = 0;
  }

  close() {
    this.unitId = 0;
    this.itemId = 0;
    this.isOnlyMe = 0;

    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}
