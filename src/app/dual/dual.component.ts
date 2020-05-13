import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';
import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

import { BattleManager } from '../battle-manager';
import { ItemManager } from '../item-manager';
import { TreasureManager } from '../treasure-manager';
import { UnitManager } from '../unit-manager';

import * as moment from 'moment';


@Component({
  selector: 'app-dual',
  templateUrl: './dual.component.html',
  styleUrls: ['./dual.component.css']
})
export class DualComponent implements OnInit {

  @ViewChild('teamSelection') teamSelection;
  @ViewChild('battle') battle;
  @ViewChild('dualRules') dualRules;
  @ViewChild('alertMessage') alertMessage;
  @ViewChild('loginBox') loginBox;
  @Input() profile: any;
  @Output() onRefreshLeftSide: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  willShowRules: boolean = false;
  isLoadingTime: boolean = false;
  waitingForHistory: boolean = false;

  battleManager: any = null;
  unitManager: any = null;
  itemManager: any = null;
  treasureManager: any = null;
  unitData: any;
  waitingForData: boolean = false;

  history: Array<any> = [];

  now = 0;
  canAttack:boolean = false;
  canAttackTime:number = 0;
  canAttackCount:number = 0;
  canAttackPaid:number = 0;

  hoursRemain:number = 0;
  minutesRemain:number = 0;
  secondsRemain:number = 0;

  willShowLoginBox: boolean = false;

  language: number = 0;

  peerArray:Array<any> = [];
  page: number = 0;
  sortBy: string = 'smart';
  hasNext: boolean = false;

  myRank: string = '';

  battleField: any = null;
  battleRecord: any = null;

  waitingForBattle: boolean = false;
  inBattle: boolean = false;
  showTeamSelection = false;
  battleAddress: string = '';
  battleIndex: number = 0;

  waitingForCanAttack: boolean = false;
  waitingForPay: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.battleManager = new BattleManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);
 
    this.unitData = environment.unitData;
    setInterval(() => this._tickTime(), 1000);

    this.loadPage(0);
    this.loadRecentRecords();

    this.waitingForCanAttack = true;
    this.battleManager.canAttackObj().then(obj => {
      this.canAttackTime = obj.attack;
      this.canAttackCount = obj.attackCount || 0;
      this.canAttackPaid = obj.attackPaid || 0;
      this.waitingForCanAttack = false;
    });

    if (!this.profile.walletReady || !this.profile.hasStarted) {
      this.showLoginBox();
    }
  }

  _tickTime() {
    this.now = Math.floor((new Date()).getTime() / 1000);

    this.canAttack = this.now > this.canAttackTime + this.profile.timeD &&
        this.profile.hasStarted;

    const r = Math.max(0, this.canAttackTime + this.profile.timeD - this.now);
    this.hoursRemain = Math.floor(r / 3600);
    this.minutesRemain = Math.floor((r % 3600) / 60);
    this.secondsRemain = Math.floor(r % 60);

    this.peerArray.forEach(peer => {
      peer.timeSafe = Math.max(0, peer.timeSafeTime + this.profile.timeD - this.now);
      if (peer.timeSafe <= 0) {
        peer.isSafe = false;
        peer.isVerySafe = false;
      }
    });
  }

  nextAttack(now) {
    return 0;
  }

  timeAsString(r: number) {
    const h = Math.floor(r / 3600);
    const m = Math.floor((r % 3600) / 60);
    const s = Math.floor(r % 60);
    return (h >= 10 ? h : '0' + h) + ':' +
        (m >= 10 ? m : '0' + m) + ':' +
        (s >= 10 ? s : '0' + s);
  }

  payForAttack() {
    this.waitingForPay = true;

    this.contractService.payForAttack().then(async _ => {
      this.canAttackPaid += 1;
      this.profile.balance = await this.treasureManager.getMyBalance();

      this.waitingForPay = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Your don\'t have enough gas', '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waitingForPay = false;
    });
  }

  timeAsCN(time: number) {
    return moment(time.toString(), 'X').locale('zh-cn').fromNow();
  }

  timeAsEN(time: number) {
    return moment(time.toString(), 'X').locale('us-en').fromNow();
  }

  loadRecentRecords() {
    this.waitingForHistory = true;
    this.battleManager.getHistory().then(history => {
      this.history = history.slice(history.length - 10, history.length);

      this.waitingForHistory = false;
    }, err => {
      this.waitingForHistory = false;
    });
  }

  loadPage(page: number) {
    this.page = page;
    this._loadPage();
  }

  _loadPage() {
    this.waitingForData = true;
    this.unitManager.getPeersAndUpdateMyStat(this.gateService, this.sortBy, 11, this.page * 10, this.profile.stat).then(peerArray => {
      this.waitingForData = false;
      this.peerArray = peerArray.slice(0, 10);
      this.hasNext = peerArray.length > 10;

      this.peerArray.forEach(peer => {
        this.battleManager.canDefenseObj(peer.name).then(obj => {
          peer.isSafe = this.now < obj.defense + this.profile.timeD;
          peer.isVerySafe = peer.isSafe && obj.defenseCount >= 1;
          peer.timeSafe = Math.max(0, obj.defense + this.profile.timeD - this.now);
          peer.timeSafeTime = obj.defense;
        });
      });
    });
  }

  onSortBy(e: any) {
    e.blur();

    if (e.value == this.sortBy) return;

    this.sortBy = e.value;

    this.loadPage(this.page);
  }

  showRule() {
    this.willShowRules = true;
  }

  onClose() {
    this.willShowRules = false;
  }

  startBattle(address: string, index: number) {
    this.battleAddress = address;
    this.battleIndex = index;
    this.showTeamSelection = true;
  }

  finishBattle() {
    this.inBattle = false;

    this.loadRecentRecords();
  }

  async _processBattleField(unitIdArray, peerUnitIdArray, who) {
    this.battleField = [];

    const peerUnits = await this.unitManager.getPeerStatusLite(this.itemManager, who);

    peerUnitIdArray.map(unitId => {
      if (!unitId) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
        return;
      }

      const results = peerUnits.filter(unit => {
        return unit.unitId == unitId;
      });

      this.battleField.push({
        unitId: results[0].unitId,
        level: results[0].level,
        hp: results[0].hp
      });
    });

    unitIdArray.map(unitId => {
      if (!unitId) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
        return;
      }

      const results = this.profile.units.filter(unit => {
        return unit.unitId == unitId;
      });

      this.battleField.push({
        unitId: results[0].unitId,
        level: results[0].level,
        hp: results[0].hp + results[0].hpP
      });
    });
  }

  async onSelectTeam($event) {
    this.showTeamSelection = false;
    this.waitingForBattle = true;

    const peerUnitIdArray = this.peerArray[this.battleIndex].units.map(unit => unit.unitId);

    await this._processBattleField($event.unitIdArray, peerUnitIdArray, this.battleAddress);

    this.contractService.battleWithPeer(
        $event.unitIdArray, this.battleAddress, false).then(battleRecord => {
      console.log(battleRecord);
      this.battleRecord = battleRecord;

      this.waitingForBattle = false;
      this.inBattle = true;

      // Let's refresh.

      this._loadPage();
      this.loadRecentRecords();

      this.battleManager.canAttackObj().then(obj => {
        this.canAttackTime = obj.attack;
        this.canAttackCount = obj.attackCount || 0;
        this.canAttackPaid = obj.attackPaid || 0;
      });
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('no attack in 48 hours') >= 0) {
        this.showAlert('48小时内已经攻击过此用户', 'Had attacked this player in 48 hours',
            '请换一个目标', 'Please change your target');
      } else if (err.indexOf('can not attack') >= 0) {
        this.showAlert('此用户在安全状态', 'This player is in safe mode',
            '似乎已被他人攻击，请刷新后再试', 'Seams someone attacked him before you; please refresh and retry');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      }

      this.waitingForBattle = false;
    });
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.battle) {
      this.battle.changeLanguage(language);
    }

    if (this.teamSelection) {
      this.teamSelection.changeLanguage(language);
    }

    if (this.dualRules) {
      this.dualRules.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }

    if (this.loginBox) {
      this.loginBox.changeLanguage(language);
    }
  }

  onFinishTeam() {
    this.showTeamSelection = false;
  }

  setTeams() {
    this.onSetTeams.emit();
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

  showLoginBox() {
    this.willShowLoginBox = true;
  }

  closeLoginBox() {
    this.willShowLoginBox = false;
  }
}
