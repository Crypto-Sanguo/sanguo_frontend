import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-gear-selection',
  templateUrl: './player-gear-selection.component.html',
  styleUrls: ['./player-gear-selection.component.css']
})
export class PlayerGearSelectionComponent implements OnInit {

  @Input() profile: any;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  unitArray = [];
  waiting = false;
  selectedUnitId = 0;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    
    this.loadMyProfile();
  }

  loadMyProfile() {
    this.profile.units.map(unit => {
      const unitId = unit.unitId;

      if (this.selectedUnitId == 0) this.selectedUnitId = unitId;

      if (unitId != 0) {
        this.unitArray.push({
          unitId: unitId,
          nameCN: environment.unitData[unitId].nameCN,
          nameEN: environment.unitData[unitId].nameEN
        });
      }
    });
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  select() {
    if (this.selectedUnitId == 0) return;

    this.waiting = true;
    this.onSelect.emit({unitId: this.selectedUnitId});
  }

  close() {
    this.onClose.emit();
  }
}
