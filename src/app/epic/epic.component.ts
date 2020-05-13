import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { EpicManager } from '../epic-manager';
import { ItemManager } from '../item-manager';
import { TreasureManager } from '../treasure-manager';
import { UnitManager } from '../unit-manager';


import * as moment from 'moment';


@Component({
  selector: 'app-epic',
  templateUrl: './epic.component.html',
  styleUrls: ['./epic.component.css']
})
export class EpicComponent implements OnInit {

  @Input() profile: any;
  @ViewChild('alertMessage') alertMessage;

  epicManager: any = null;
  itemManager: any = null;
  treasureManager: any = null;
  unitManager: any = null;

  tabIndex: number = 0;

  waitingForHistory: boolean = false;
  history: Array<any> = [];
  queue: Array<any> = [];
  damageArray: Array<any> = [];

  waitingForBattle: boolean = false;
  waitingForAnimation: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  fakeProfile: any = {
    units: []
  };
  inBattle: boolean = false;
  battleField: any = null;
  battleRecord: any = null;
  bossStatus: any = null;

  bossDead: boolean = false;

  awardLoading: boolean = false;
  informationLoading: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.epicManager = new EpicManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.loadHistory();

    this.language = parseInt(localStorage.getItem('language'));
  }

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    if (tabIndex == 0) {
      this.loadHistory();
    } else if (tabIndex == 1) {
      this.loadQueue();
    } else {
      this.loadDamage();
    }
  }

  async loadHistory() {
    this.waitingForHistory = true;

    this.bossStatus = await this.epicManager.getBossStatus();
    this.bossDead = this.bossStatus.hpR <= 0;

    this.history = await this.epicManager.getHistory();
    this.history.forEach((entry, index) => {
      entry.push(index);
    });
    this.history.reverse();
    this.waitingForHistory = false;
  }

  async loadDamage() {
    this.waitingForHistory = true;

    const map = {};

    this.history = await this.epicManager.getHistory();
    this.history.forEach((entry, index) => {
      map[entry[1]] =  map[entry[1]] ? map[entry[1]] + entry[2] * 1 : entry[2] * 1;
    });


    this.damageArray = [];
    for (let who in map) {
      this.damageArray.push([who, map[who]]);
    }

    this.damageArray.sort((a, b) => b[1] - a[1]);

    this.waitingForHistory = false;
  }

  async loadQueue() {
    this.waitingForHistory = true;
    this.queue = await this.epicManager.getQueue();
    this.waitingForHistory = false;
  }

  timeAsCN(time: number) {
    return moment(time.toString(), 'X').locale('zh-cn').fromNow();
  }

  timeAsEN(time: number) {
    return moment(time.toString(), 'X').locale('us-en').fromNow();
  }

  async battle(times: number) {
    this.waitingForBattle = true;
    this.contractService.queueForBattle(times, 30 * times).then(async _ => {
      this.waitingForBattle = false;
      this.showAlert('排队成功','Joined the Queue','等轮到您的时候，战斗结果会进入记录','When it\'s your turn, the battle result will be recorded.');
      this.profile.balance = await this.treasureManager.getMyBalance();
    }, err => {
      this.waitingForBattle = false;

      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Your don\'t have enough gas', '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }
    });
  }

  async viewBattle(entry: any) {
    this.waitingForAnimation = true;

    this.battleRecord = {
      didIWin: this.bossStatus.hpR <= 0 && entry[4] == this.history.length - 1,
      records: await this.epicManager.getRecords(entry[4]),
      snatch: {
        amount: 0
      }
    }

    await this._processBattleField(entry[1], entry[3]);
    this.waitingForAnimation = false;

    this.inBattle = true;
  }

  async _processBattleField(who: string, cheatArrayStr: string) {
    this.battleField = [];

    const cheatArray = JSON.parse(cheatArrayStr);

    this.battleField.push({unitId: cheatArray[0], level: 10, hp: cheatArray[1]});
    this.battleField.push({unitId: cheatArray[2], level: 10, hpR: cheatArray[3], hp: this.bossStatus.hpX});
    this.battleField.push({unitId: cheatArray[4], level: 10, hp: cheatArray[5]});

    const myUnits = await this.unitManager.getPeerStatusLite(this.itemManager, who);
    const myUnitIdArray = await this.unitManager.getDefenseUnitIdArrayOf(who);

    myUnitIdArray.map(unitId => {
      if (!unitId) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
        return;
      }

      const results = myUnits.filter(unit => {
        return unit.unitId == unitId;
      });

      this.battleField.push({
        unitId: results[0].unitId,
        level: results[0].level,
        hp: results[0].hp
      });
    });
  }

  finishBattle() {
    this.inBattle = false;
  }

  async showInformation() {
    this.informationLoading = true;
    const information = await this.epicManager.getInformation();
    this.informationLoading = false;

    this.showAlert('奖励', 'Rewards',
        information[0], information[1]);
  }

  async showAward() {
    this.awardLoading = true;
    const award = await this.epicManager.getAward();

    var txtCN = '';
    var txtEN = '';

    award.forEach(line => {
      const itemId = line[2][0];
      const itemAmount = line[2][1]
      txtCN += line[0] + '获得' + line[1] + ' SGT, 和' + environment.itemData[itemId].nameCN + " " + itemAmount + "件" + '\n';
      txtEN += line[0] + ' got ' + line[1] + ' SGT, and ' + itemAmount + ' ' + environment.itemData[itemId].nameEN + '\n';
    });

    this.awardLoading = false;

    this.showAlert('奖励', 'Rewards', txtCN, txtEN);
  }

  showAlert(titleCN: string, titleEN: string, bodyCN: string, bodyEN: string) {
    this.alertTitleCN = titleCN;
    this.alertTitleEN = titleEN;
    this.alertBodyCN = bodyCN;
    this.alertBodyEN = bodyEN;
    this.willShowAlertMessage = true;
  }

  closeAlert() {
    this.willShowAlertMessage = false;
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }
}
