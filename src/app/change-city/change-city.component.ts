import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { LandManager } from '../land-manager';


@Component({
  selector: 'app-change-city',
  templateUrl: './change-city.component.html',
  styleUrls: ['./change-city.component.css']
})
export class ChangeCityComponent implements OnInit {
  @Input() currentCityId: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onCloseAndRefresh: EventEmitter<any> = new EventEmitter();

  landManager: any = null;
  allCities: Array<any> = [];
  selectedCityId: number = 0;

  waiting: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.landManager = new LandManager(this.contractService.myIOST);

    this.waiting = true;
    this.landManager.getAllCities().then(cities => {
      this.allCities = cities;
      this.waiting = false;
    });
  }

  changeCity(cityId: number) {
    if (!cityId) return;

    this.onCloseAndRefresh.emit({
      cityId: cityId
    });
  }

  cityIdToCityName(cityId: number) {
    if (cityId >= 1024) {
      return environment.smallCityNames[cityId - 1024];
    } else if (cityId >= 2) {
      return environment.bigCityNames[cityId - 2];
    } else {
      return ['长安', 'Chang\'an'];
    }
  }

  close() {
    this.onClose.emit();
  }

  changeLanguage(language: number) {
    this.language = language;
  }
}
