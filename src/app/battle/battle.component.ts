import { Component, EventEmitter, ElementRef, ViewChild, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css']
})
export class BattleComponent implements OnInit {

  @Input() profile: any;
  @Input() battleField: any;
  @Input() battleRecord: any;
  @Input() isDuel: boolean;
  @Input() unitLimit: number;

  @Output() onFinish: EventEmitter<any> = new EventEmitter();

  @ViewChild('container') container: ElementRef;
  @ViewChild('myFrame') myFrame: ElementRef;

  randomUrl: any;

  inReward: boolean = false;

  itemDropAmount: number = 0;

  didWin: boolean = false;
  itemNameCN: string = "";
  itemNameEN: string = "";
  imagePath: string = "/assets/images/token.jpg";
  amount: number = 0;
  itemId0: number = 0;
  itemAmount0: number = 0;
  itemId1: number = 0;
  itemAmount1: number = 0;

  step: number = 0;

  language: number = 0;

  constructor(private contractService: ContractService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.randomUrl = this.sanitizer.bypassSecurityTrustResourceUrl("assets/battlefield/index.html?r=" + Math.random());
    
    let containerWidth = this.container.nativeElement.offsetWidth;
    let containerHeight = this.container.nativeElement.offsetHeight;

    this.myFrame.nativeElement.width = Math.min(containerWidth, containerHeight * 680 / 720);
    this.myFrame.nativeElement.height = Math.min(containerHeight, containerWidth * 720 / 680);

    let loaded = false;

    setInterval(() => {
      if (loaded) return;

      const contentWindow = document.getElementById("myFrame")['contentWindow'];
      if (!contentWindow || !contentWindow['battlefield']) return;

      loaded = true;

      this.loadBattleField();
      setTimeout(() => {
        this.loadBattleRecords();
      }, 1000);
    }, 1000);
  }

  loadBattleField() : void {
    const hpRArray = [];
    const hpArray = [];
    const levelArray = [];
    const unitIdArray = [];
    const itemIdArray = [];

    this.battleField.map(unit => {
      if (unit.hpR) {
        hpRArray.push(unit.hpR);
      } else {
        hpRArray.push(unit.hp);
      }

      hpArray.push(unit.hp);
      levelArray.push(unit.level);
      unitIdArray.push(unit.unitId);
      itemIdArray.push(0);  // TODO: remove itemIdArray
    });

    const contentWindow = document.getElementById("myFrame")['contentWindow'];
    contentWindow['battlefield'].loadBattleField(hpRArray, hpArray, levelArray, unitIdArray, itemIdArray);
  }

  loadBattleRecords() : void {
    this.didWin = !!(this.battleRecord.didIWin);

    if (this.didWin) {
      if (this.isDuel) {
        this.amount = this.battleRecord.snatch.amount;
      } else {
        this.amount = this.battleRecord.drop.tokenAmount;

        this.battleRecord.drop.itemIdArray.forEach(itemId => {
          if (!this.itemId0) {
            this.itemId0 = itemId;
          }
          if (!this.itemId1 && itemId != this.itemId0) {
            this.itemId1 = itemId;
          }
          if (itemId == this.itemId0) ++this.itemAmount0;
          if (itemId == this.itemId1) ++this.itemAmount1;
        });
      }
    }

    const isMyTurnArray = [];
    const myIndexArray = [];
    const enemyIndexArray = [];
    const skillArray = [];
    const valueArray = [];

    this.battleRecord.records.map(record => {
      const kIndex = record[0];
      const tIndex = record[1];
      const skill = record[2];

      if (kIndex == 0 && tIndex == 0 && skill == 0) return;

      skillArray.push(skill);

      if (kIndex > this.unitLimit) {
        isMyTurnArray.push(false);
        myIndexArray.push(tIndex);
        enemyIndexArray.push(kIndex - this.unitLimit - 1);
      } else {
        isMyTurnArray.push(true);
        myIndexArray.push(kIndex - 1);
        enemyIndexArray.push(tIndex);
      }

      if (record.length == this.unitLimit + 3) {
        if (record.length == 6) {
          valueArray.push([record[3], record[4], record[5]]);
        } else {
          valueArray.push([record[3], record[4], record[5], record[6], record[7], record[8]]);
        }
      } else {
        valueArray.push([record[3]]);
      }
    });

    const contentWindow = document.getElementById("myFrame")['contentWindow'];

    contentWindow['battlefield'].loadBattleRecords(this.didWin, isMyTurnArray, myIndexArray, enemyIndexArray, skillArray, valueArray, () => {
      if (this.didWin) {
        if (this.isDuel) {
          if (this.battleRecord.balance) {
            this.profile.balance = this.battleRecord.balance;
          }
        } else {
          // Update SGT balance.
          if (this.battleRecord.balance) {
            this.profile.balance = this.battleRecord.balance;
          }

          // Update items.
          this.profile.items = this.profile.items.concat(this.battleRecord.items || []);
          this.profile.items.sort((a, b) => b.itemId - a.itemId);
        }
      }

      // Update energies
      if (this.battleRecord.energies) {
        this.battleRecord.energies.map((energy, index) => {
          const unitId = this.battleField[index + this.unitLimit].unitId;
          if (unitId == 0) return;

          for (let i = 0; i < this.profile.units.length; ++i) {
            if (this.profile.units[i].unitId == unitId) {
              this.profile.units[i].energy.time = energy.time;
              this.profile.units[i].energy.amount = energy.amount;
              break;
            }
          }
        });
      }

      this.inReward = true;
    });
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  next() {
    ++this.step;

    if (this.step == 1) {
      if (this.itemId0 == 0) {
        if (this.itemId1 == 0) {
          this.onFinish.emit({didWin: this.didWin});
          return;
        } else {
          ++this.step;
        }
      } else {
        this.imagePath = environment.itemData[this.itemId0].imagePath;
        this.itemNameCN = environment.itemData[this.itemId0].nameCN;
        this.itemNameEN = environment.itemData[this.itemId0].nameEN;
        this.itemDropAmount = this.itemAmount0;
      }
    }

    if (this.step == 2) {
      if (this.itemId1 == 0) {
        this.onFinish.emit({didWin: this.didWin});
        return;
      }

      this.imagePath = environment.itemData[this.itemId1].imagePath;
      this.itemNameCN = environment.itemData[this.itemId1].nameCN;
      this.itemNameEN = environment.itemData[this.itemId1].nameEN;
      this.itemDropAmount = this.itemAmount1;
    }

    if (this.step > 2) {
      this.onFinish.emit({didWin: this.didWin});
    }
  }
}
