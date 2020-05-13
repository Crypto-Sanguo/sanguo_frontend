import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { TournamentManager } from '../tournament-manager';
import { ItemManager } from '../item-manager';
import { TreasureManager } from '../treasure-manager';
import { UnitManager } from '../unit-manager';


import * as moment from 'moment';


@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

  @Input() profile: any;

  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  @ViewChild('alertMessage') alertMessage;

  tournamentManager: any = null;
  itemManager: any = null;
  treasureManager: any = null;
  unitManager: any = null;

  tabIndex: number = 0;

  countIWin: number = 0;
  countTotal: number = 0;
  sgtTotal: number = 0;
  estimate: number = 0;

  myTimes: number = 0;
  amInQueue: boolean = false;

  waitingForHistory: boolean = false;
  history: Array<any> = [];
  queue: Array<any> = [];
  rewardArray: Array<any> = [];

  hoursRemain: number = 0;
  minutesRemain: number = 0;

  waitingForBattle: boolean = false;
  waitingForAnimation: boolean = false;
  waitingForPool: boolean = false;

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

  tournamentStatus: any = null;
  gameOver: boolean = false;

  showTeamSelection: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.tournamentManager = new TournamentManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.loadHistory();
    this.loadPool();
    this.loadTimes();

    setInterval(() => this._tickTime(), 1000);

    this.language = parseInt(localStorage.getItem('language'));
  }

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    if (tabIndex == 0) {
      this.loadHistory();
    } else if (tabIndex == 1) {
      this.loadQueue();
    } else {
      this.loadResult();
    }
  }

  async loadPool() {
    this.waitingForPool = true;

    this.tournamentStatus = await this.tournamentManager.getTournamentStatus();
    this.gameOver = this.tournamentStatus.gameOver;

    const rewardMap = await this.tournamentManager.getReward();
    this.sgtTotal = rewardMap['-total'];
    this.countIWin = rewardMap[this.contractService.getUserAddress()] || 0;
    this.countTotal = 0;

    for (let who in rewardMap) {
      if (who == "-total") continue;
      this.countTotal += rewardMap[who]
    }

    if (this.countIWin > 0) {
      this.estimate = this.sgtTotal * this.countIWin / this.countTotal;
    } else {
      this.estimate = 0;
    }

    this.waitingForPool = false;
  }

  async loadTimes() {
    const times = await this.tournamentManager.getTimes();

    this.myTimes = 0;

    for (let who in times) {
      if (who == this.contractService.getUserAddress()) {
        this.myTimes = times[who];
        break;
      }
    }

    this.queue = await this.tournamentManager.getQueue();
    this.amInQueue = false;
    for (let i = 0; i < this.queue.length; ++i) {
      if (this.queue[i][0] == this.contractService.getUserAddress()) {
        this.amInQueue = true;
        break;
      }
    }
  }

  async loadHistory() {
    this.waitingForHistory = true;

    this.tournamentStatus = await this.tournamentManager.getTournamentStatus();
    this.gameOver = this.tournamentStatus.gameOver;

    this.history = await this.tournamentManager.getHistory();
    this.history.reverse();
    this.waitingForHistory = false;
  }

  async loadResult() {
    this.waitingForHistory = true;
    this.rewardArray = [];

    const rewardMap = await this.tournamentManager.getReward();
    for (let who in rewardMap) {
      if (who == "-total" || who == "-pre") continue;

      this.rewardArray.push([who, rewardMap[who]]);
    }

    this.waitingForHistory = false;
  }

  async loadQueue() {
    this.waitingForHistory = true;
    this.queue = await this.tournamentManager.getQueue();
    this.waitingForHistory = false;
  }

  timeAsCN(time: number) {
    return moment(time.toString(), 'X').locale('zh-cn').fromNow();
  }

  timeAsEN(time: number) {
    return moment(time.toString(), 'X').locale('us-en').fromNow();
  }

  join() {
    if (this.profile.unitsLoading) {
      this.showAlert("请等待英雄读取", "Please wait for loading heroes",
                     "晚几秒再开战", "Come back in a few seconds");
      return;
    }

    this.showTeamSelection = true;
  }

  onSelectTeam($event) {
    this.showTeamSelection = false;

    this.waitingForBattle = true;
    this.contractService.queueForTournament($event.unitIdArray).then(async _ => {
      this.waitingForBattle = false;
      this.showAlert('排队成功','Joined the Queue','等轮到您的时候，战斗结果会进入记录','When it\'s your turn, the battle result will be recorded.');
      this.profile.balance = await this.treasureManager.getMyBalance();
      this.amInQueue = true;
    }, err => {
      this.waitingForBattle = false;

      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Your don\'t have enough gas', '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else if (err.indexOf('aleady-in-queue') >= 0) {
        this.showAlert('您已在排队中', 'You are already in queue', '出局前无需重复排队', 'No need to join again before losing');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }
    });
  }

  onFinishTeam() {
    this.showTeamSelection = false;
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
  }

  async viewBattle(entry: any, index: number) {
    this.waitingForAnimation = true;

    this.battleRecord = {
      didIWin: entry[3] == entry[5],
      records: await this.tournamentManager.getRecords(index),
      snatch: {
        amount: 0
      }
    }

    await this._processBattleField(entry[1], entry[2], entry[3], entry[4]);
    this.waitingForAnimation = false;

    this.inBattle = true;
  }

  async _processBattleField(first: string, firstUnitIdArray: number[], second: string, secondUnitIdArray: number[]) {
    this.battleField = [];

    const secondUnits = await this.unitManager.getPeerStatusPro(this.itemManager, second, secondUnitIdArray);

    for (let i = 0; i < secondUnitIdArray.length; ++i) {
      if (!secondUnitIdArray[i]) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
      } else {
        const results = secondUnits.filter(unit => {
          return unit.unitId == secondUnitIdArray[i];
        });

        this.battleField.push({
          unitId: secondUnitIdArray[i],
          level: results[0].level,
          hp: results[0].hp
        });
      }
    }

    const firstUnits = await this.unitManager.getPeerStatusPro(this.itemManager, first, firstUnitIdArray);

    for (let i = 0; i < firstUnitIdArray.length; ++i) {
      if (!firstUnitIdArray[i]) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
      } else {
        const results = firstUnits.filter(unit => {
          return unit.unitId == firstUnitIdArray[i];
        });

        this.battleField.push({
          unitId: firstUnitIdArray[i],
          level: results[0].level,
          hp: results[0].hp
        });
      }
    }
  }

  finishBattle() {
    this.inBattle = false;
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return +(x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return +(x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return (x / 1000.0).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return +(x / 1000.0).toFixed(1) + ' K';
    } else if (x > 10) {
      return +(x * 1).toFixed(1);
    } else if (x > 1) {
      return +(x * 1).toFixed(2);
    } else if (x > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
  }

  _tickTime() {
    if (!this.tournamentStatus || !this.tournamentStatus.expiration) return;

    const now = Math.floor((new Date()).getTime() / 1000);
    const r = Math.max(0, this.tournamentStatus.expiration + this.profile.timeD - now);

    this.hoursRemain = Math.floor(r / 3600);
    this.minutesRemain = Math.floor((r % 3600) / 60);
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
