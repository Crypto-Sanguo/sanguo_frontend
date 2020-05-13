import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { UnitManager } from '../unit-manager';

@Component({
  selector: 'app-market-info',
  templateUrl: './market-info.component.html',
  styleUrls: ['./market-info.component.css']
})
export class MarketInfoComponent implements OnInit {

  @Input() unitId: number;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  language: number = 0;

  descriptionCN: string = '';
  descriptionEN: string = '';

  nameCN: string = '';
  nameEN: string = '';

  unitManager: any = null;

  heroHp: number = 0;
  heroAttack: number = 0;
  heroIntelligence: number = 0;
  heroDefense: number = 0;
  heroAgility: number = 0;
  heroLuck: number = 0;

  heroHpStep: number = 0;
  heroAttackStep: number = 0;
  heroIntelligenceStep: number = 0;
  heroDefenseStep: number = 0;
  heroAgilityStep: number = 0;
  heroLuckStep: number = 0;

  waiting: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.descriptionCN = environment.unitData[this.unitId].descriptionCN;
    this.descriptionEN = environment.unitData[this.unitId].descriptionEN;

    this.nameCN = environment.unitData[this.unitId].nameCN;
    this.nameEN = environment.unitData[this.unitId].nameEN;

    this.waiting = true;

    this.unitManager.getUnit(this.unitId).then(info => {
      this.heroHp = info.hp;
      this.heroAttack = info.attack;
      this.heroIntelligence = info.intelligence;
      this.heroDefense = info.defense;
      this.heroAgility = info.agility;
      this.heroLuck = info.luck;
      this.heroHpStep = info.hpStep;
      this.heroAttackStep = info.attackStep;
      this.heroIntelligenceStep = info.intelligenceStep;
      this.heroDefenseStep = info.defenseStep;
      this.heroAgilityStep = info.agilityStep;
      this.heroLuckStep = info.luckStep;
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
