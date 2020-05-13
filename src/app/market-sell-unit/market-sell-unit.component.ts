import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-market-sell-unit',
  templateUrl: './market-sell-unit.component.html',
  styleUrls: ['./market-sell-unit.component.css']
})
export class MarketSellUnitComponent implements OnInit {

  @Input() profile: any;
  @Output() onCloseAndRefresh: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  unitArray = [];
  waiting = false;

  selectedUnitId:number = 0;
  price:number = 0;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    
    this.loadMyProfile();
  }

  loadMyProfile() {
    this.profile.units.map(unit => {
      if (!unit.forSale) {
        if (!this.selectedUnitId) this.selectedUnitId = unit.unitId;

        const unitNameCN = environment.unitData[unit.unitId].nameCN;
        const unitNameEN = environment.unitData[unit.unitId].nameEN;

        this.unitArray.push({
          id: unit.unitId,
          nameCN: unitNameCN,
          nameEN: unitNameEN
        });
      }
    });
  }

  select() {
    if (!this.selectedUnitId) return;

    const priceInt = Math.ceil(this.price);

    if (priceInt <= 0) return;

    this.waiting = true;

    this.contractService.sellUnitOffer(this.selectedUnitId, priceInt).then(_ => {
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
