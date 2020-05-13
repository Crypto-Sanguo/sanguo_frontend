import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { LandManager } from '../land-manager';


@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.css']
})
export class CreateCityComponent implements OnInit {
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onCloseAndRefresh: EventEmitter<any> = new EventEmitter();

  waiting: boolean = false;

  selectedCitySize: number = 50;
  selectedNameIndex: number = 0;
  cityNamesData: any = {};

  landManager: any = null;
  allCityIds: Array<number> = [];

  totalPrice: number = 0;
  totalPriceLoading: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.cityNamesData = {
      50: environment.smallCityNames,
      100: environment.bigCityNames
    };

    this.landManager = new LandManager(this.contractService.myIOST);

    this.landManager.getAllCityIds().then(ids => {
      this.allCityIds = ids;
    });

    this.estimatePrice(this.selectedCitySize);
  }

  onChangeSize($event: any) {
    this.estimatePrice(this.selectedCitySize);
  }

  async estimatePrice(size: number) {
    this.totalPriceLoading = true;
    this.totalPrice = await this.landManager.estimateCityPrice(size);
    this.totalPriceLoading = false;
  }

  isNameTaken(isBig, index) {
    const offset = isBig ? 2 + index : 1024 + index;
    return this.allCityIds.indexOf(offset) >= 0;
  }

  buyCity(nameIndex, citySize) {
    const offset = citySize == 100 ? 2 : 1024;
    const cityId = nameIndex + offset;

    this.waiting = true;

    this.contractService.buyCity(cityId, citySize, this.totalPrice).then(landIds => {
      this.waiting = false;

      this.onCloseAndRefresh.emit();
    }, err => {
      this.waiting = false;
    });
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}
