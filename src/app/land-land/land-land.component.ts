import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { BattleManager } from '../battle-manager';
import { LandManager } from '../land-manager';
import { ItemManager } from '../item-manager';
import { UnitManager } from '../unit-manager';
import { TreasureManager } from '../treasure-manager';


@Component({
  selector: 'app-land-land',
  templateUrl: './land-land.component.html',
  styleUrls: ['./land-land.component.css']
})
export class LandLandComponent implements OnInit {

  @Input() profile: any;
  @Input() cityId: number;
  @Input() cityOwner: string;
  @Output() onGoBack: EventEmitter<any> = new EventEmitter();
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;
  @ViewChild('playerGearSelection') playerGearSelection;
  @ViewChild('landRent') landRent;
  @ViewChild('landSell') landSell;
  @ViewChild('changeCity') changeCity;
  @ViewChild('taxRate') taxRate;
  @ViewChild('taxRecord') taxRecord;
  @ViewChild('teamSelection') teamSelection;
  @ViewChild('battle') battle;

  battleManager: any = null;
  landManager: any = null;
  itemManager: any = null;
  unitManager: any = null;
  treasureManager: any = null;

  waiting: boolean = false;
  lands: Array<any> = [];

  currentPage: number = 1;
  hasMore: boolean = false;

  battlePeer: string = '';
  battleField: any = null;
  battleRecord: any = null;
  waitingForBattle: boolean = false;
  inBattle: boolean = false;
  showTeamSelection = false;
  landIdToAttack: number = 0;
  landIdToAttackPaid: boolean = false;

  selectedLandIndex: number;
  selectedUnitIndex: number;
  willShowSelection: boolean = false;
  willShowRent: boolean = false;
  willShowSell: boolean = false;
  willShowChangeCity: boolean = false;
  willShowTaxRate: boolean = false;
  willShowTaxRecord: boolean = false;

  isCityDefeated: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.battleManager = new BattleManager(this.contractService.myIOST);
    this.landManager = new LandManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);

    this.gotoPage(1);
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

  refresh() {
    this.gotoPage(this.currentPage);
  }

  async gotoPage(page: number) {
    if (page < 1) return;

    this.currentPage = page;

    const b = (page - 1) * 20;
    const e = page * 20 + 1;
    this.waiting = true;

    if (this.cityId) {
      this.lands = await this.landManager.getLandsInCity(this.cityId, b, e, this.treasureManager);
    } else {
      this.lands = await this.landManager.getMyLands(b, e, this.treasureManager);
    }

    this.hasMore = this.lands.length > 20;
    this.lands = this.lands.slice(0, 20);

    this.waiting = false;

    // Checks whether the city is defeated.
    if (this.cityId) {
      const city = await this.landManager.getOneCity(this.cityId);

      const now = Math.floor((new Date()).getTime() / 1000);
      if (this._ceilDate(now - this.profile.timeD) == this._ceilDate(city.defeat || 0)) {
        this.isCityDefeated = true;
      }
    }
  }

  goBack() {
    this.onGoBack.emit();
  }

  getUnitImage(unitId: number) {
    return environment.unitData[unitId].imagePath;
  }

  getUnitName(unitId: number) {
    return [environment.unitData[unitId].nameCN, environment.unitData[unitId].nameEN];
  }

  rentTo(index: number) {
    this.selectedLandIndex = index;
    this.willShowRent = true;
  }

  onCloseAndRent($event) {
    this.waiting = true;
    this.willShowRent = false;

    this.contractService.rentTo(this.lands[this.selectedLandIndex].landId, $event.price, $event.duration).then(_ => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[this.selectedLandIndex].landId], this.treasureManager).then(arr => {
        this.lands[this.selectedLandIndex] = arr[0];
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  onCloseRent() {
    this.willShowRent = false;
  }

  rentCancel(index: number) {
    this.waiting = true;

    this.contractService.rentCancel(this.lands[index].landId).then(_ => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[index].landId], this.treasureManager).then(arr => {
        this.lands[index] = arr[0];
      });
      
      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  sellLand(index: number) {
    this.selectedLandIndex = index;
    this.willShowSell = true;
  }

  onCloseAndSell($event) {
    this.waiting = true;
    this.willShowSell = false;

    this.contractService.sellLand(this.lands[this.selectedLandIndex].landId, $event.price).then(_ => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[this.selectedLandIndex].landId], this.treasureManager).then(arr => {
        this.lands[this.selectedLandIndex] = arr[0];
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  sellCancel(index: number) {
    this.waiting = true;

    this.contractService.sellCancel(this.lands[index].landId).then(_ => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[index].landId], this.treasureManager).then(arr => {
        this.lands[index] = arr[0];
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  onCloseSell() {
    this.willShowSell = false;
  }

  oathLand(index: number) {
    this.waiting = true;

    this.contractService.oath(this.lands[index].landId).then(_ => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[index].landId], this.treasureManager).then(arr => {
        this.lands[index] = arr[0];
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('already in oath') >= 0) {
        this.showAlert('一周只能效忠一次','No more oath in 7 days', '','');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  edit(index: number) {
    const now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
    const r = now % (3600 * 24);
    if (r >= 45000 && r <= 39600) {
      this.showAlert('20:30 - 23:00 不可换防', 'No change between 20:30 and 23:00',
            '', '');
      return;
    }

    this.lands[index].inEdit = true;
  }

  saveEdit(index: number) {
    this.waiting = true;
    this.contractService.setUnitIdArrayOnLand(this.lands[index].landId, this.lands[index].unitIdArray).then(landIdsToRefresh => {
      // Refresh lands.
      this.landManager.getLandsByIds(landIdsToRefresh, this.treasureManager).then(refreshedLands => {
        for (let i = 0; i < this.lands.length; ++i) {
          for (let j = 0; j < refreshedLands.length; ++j) {
            if (this.lands[i].landId == refreshedLands[j].landId) {
              this.lands[i] = refreshedLands[j];
            }
          }
        }
      });

      this.lands[index].inEdit = false;

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('no more change today') >= 0) {
        this.showAlert('今日不可再更换', 'No more change today', '', '');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  cancelEdit(index: number) {
    this.lands[index].inEdit = false;
  }

  addUnit(i: number, j: number) {
    this.selectedLandIndex = i;
    this.selectedUnitIndex = j;
    this.willShowSelection = true;
  }

  changeUnit(i: number, j: number) {
    this.selectedLandIndex = i;
    this.selectedUnitIndex = j;
    this.willShowSelection = true;
  }

  removeUnit(i: number, j: number) {
    this.lands[i].unitIdArray[j] = 0;
  }

  onSelect($event) {
    this.willShowSelection = false;
    if (this.lands[this.selectedLandIndex].unitIdArray.length == 0) {
      this.lands[this.selectedLandIndex].unitIdArray = [0, 0, 0];
    }

    for (let i = 0; i < this.lands[this.selectedLandIndex].unitIdArray.length; ++i) {
      if (this.lands[this.selectedLandIndex].unitIdArray[i] &&
          this.lands[this.selectedLandIndex].unitIdArray[i] == $event.unitId) {
        this.lands[this.selectedLandIndex].unitIdArray[i] = 0;
      }
    }

    this.lands[this.selectedLandIndex].unitIdArray[this.selectedUnitIndex] = $event.unitId;
  }

  onCloseSelection() {
    this.willShowSelection = false;
  }

  revive(index: number) {
    this.waiting = true;

    this.contractService.reactivate(this.lands[index].landId).then(rIdArray => {
      // Refresh land.
      this.landManager.getLandsByIds([this.lands[index].landId], this.treasureManager).then(arr => {
        this.lands[index] = arr[0];
      });

      this.profile.items = this.profile.items.filter(item => rIdArray.indexOf(item.rId) < 0);

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('not enough item') >= 0) {
        this.showAlert('需要八卦符','Need Yin Yang Amulet', '', '');
      } else if (err.indexOf('no more reactivate') >= 0) {
        this.showAlert('今日无法再次复活','No more revive today', '', '');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  doChangeCity(index: number) {
    const now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
    const r = now % (3600 * 24);
    if (r >= 45000 && r <= 39600) {
      this.showAlert('20:30 - 23:00 不可换防', 'No change between 20:30 and 23:00',
            '', '');
      return;
    }

    this.willShowChangeCity = true;
    this.selectedLandIndex = index;
  }

  onChangeCity($event) {
    this.willShowChangeCity = false;

    this.waiting = true;

    const landId = this.lands[this.selectedLandIndex].landId;

    this.contractService.changeCity(landId, $event.cityId).then(_ => {
      this.waiting = false;
      this.refresh();
      this.showAlert('换城成功','Successfully relocated','','');
    }, err => {
      this.waiting = false;

      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('not your land') >= 0) {
        this.showAlert('您不拥有本田地', 'You don\'t own the land',
            '检查一下是否已卖出', 'Did you sell it?');
      } else if (err.indexOf('no more change today') >= 0) {
        this.showAlert('今日不可再更换', 'No more change today',
            '', '');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }
    });
  }

  onCloseChangeCity() {
    this.willShowChangeCity = false;
  }

  changeTaxRate() {
    this.willShowTaxRate = true;
  }

  onCloseTaxRate() {
    this.willShowTaxRate = false;
  }

  showTaxRecord() {
    this.willShowTaxRecord = true;
  }

  onCloseTaxRecord() {
    this.willShowTaxRecord = false;
  }

  _ceilDate(time: number): number {
    if (time < 46800) return 0;
    return Math.ceil((time - 46800) / 86400);
  }

  defeatStatus(land: any) {
    const now = Math.floor((new Date()).getTime() / 1000);
    if (this._ceilDate(now - this.profile.timeD) != this._ceilDate(land.defense)) {
      return 0;
    }

    if (land.defenseCount) return 2;

    return 1;
  }

  expirationDisplay(exp: number) {
    const now = Math.floor((new Date()).getTime() / 1000);
    const d = this._ceilDate(exp) * 24 * 3600 - (now - this.profile.timeD);
    if (d > 3600) {
      const h = Math.floor(d / 3600);
      if (h == 1) {
        return ['1小时', '1 hour'];
      } else {
        return [h + '小时', h + ' hours'];
      }
    } else {
      return ['不到1小时', 'less than 1 hour'];
    }
  }

  finishBattle($event) {
    this.inBattle = false;
    if ($event.didWin) {
      this.showAlert('击败了' + this.battlePeer, 'Defeated ' + this.battlePeer, '', '');
    } else {
      this.showAlert('败给了' + this.battlePeer, 'Defeated by ' + this.battlePeer, '', '');
    }
  }

  async _processBattleField(unitIdArray, peerUnitIdArray, who) {
    this.battleField = [];

    const peerUnits = await this.unitManager.getPeerStatusPro(this.itemManager, who, peerUnitIdArray);

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

  attackLand(landId: number, paid: boolean) {
    if (this.profile.unitsLoading) {
      this.showAlert("请等待英雄读取", "Please wait for loading heroes",
                     "晚几秒再开战", "Come back in a few seconds");
      return;
    }

    this.landIdToAttack = landId;
    this.landIdToAttackPaid = paid;

    this.showTeamSelection = true;
  }

  async onSelectTeam($event) {
    this.showTeamSelection = false;
    this.waitingForBattle = true;

    this.contractService.attackLand($event.unitIdArray, this.landIdToAttack, this.landIdToAttackPaid).then(async battleRecord => {
      console.log(battleRecord);
      this.battleRecord = battleRecord;
      this.battlePeer = battleRecord.peer;
      await this._processBattleField($event.unitIdArray, battleRecord.peerUnitIdArray, battleRecord.peer);

      this.waitingForBattle = false;
      this.inBattle = true;

      // Maybe refresh here.
      if (battleRecord.didIWin) {
        this.refresh();
      }
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else if (err.indexOf('already broken') >= 0) {
        this.showAlert('已经被他人破城', 'Already defeated by others',
            '请进城直接掠夺', 'Please enter to launch more attacks');
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

  onFinishTeam() {
    this.showTeamSelection = false;
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
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

    if (this.playerGearSelection) {
      this.playerGearSelection.changeLanguage(language);
    }

    if (this.landRent) {
      this.landRent.changeLanguage(language);
    }

    if (this.landSell) {
      this.landSell.changeLanguage(language);
    }

    if (this.taxRate) {
      this.taxRate.changeLanguage(language);
    }

    if (this.taxRecord) {
      this.taxRecord.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  isMe(who: string) {
    return this.contractService.isMe(who);
  }

  oathExpired(oath: number): boolean {
    if (!oath) return true;

    const now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
    return oath + 3600 * 24 * 7 < now;
  }
}
