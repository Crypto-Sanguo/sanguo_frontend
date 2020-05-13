import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-info',
  templateUrl: './gear-info.component.html',
  styleUrls: ['./gear-info.component.css']
})
export class GearInfoComponent implements OnInit {

  @Input() item: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  descriptionCN: string = '';
  descriptionEN: string = '';

  nameCN: string = '';
  nameEN: string = '';

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.nameCN = environment.itemData[this.item.itemId].nameCN;
    this.nameEN = environment.itemData[this.item.itemId].nameEN;

    this.language = parseInt(localStorage.getItem('language'));
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
