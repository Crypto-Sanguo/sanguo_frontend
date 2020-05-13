import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { Account } from '../account';
import { TreasureManager } from '../treasure-manager';
import { UnitManager } from '../unit-manager';

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.css']
})
export class PlayerProfileComponent implements OnInit, OnDestroy {
  
  @ViewChild('alertMessage') alertMessage;
  @ViewChild('playerFillEnergy') playerFillEnergy;
  @ViewChild('gearMount') gearMount;

  @Input() profile: any;
  @Output() onGoBack: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshEnergy: EventEmitter<any> = new EventEmitter();

  showFillEnergy = false;
  showGearMount = false;

  itemIdMounted: number = 0;
  itemRIdMounted: number = 0;
  unitIdToMount: number = 0;
  positionIndexToMount: number = 0;

  account: any = null;
  treasureManager: any = null;
  unitManager: any = null;

  unitData: any = null;
  itemArrayByUnitId: any = {};

  canRecoverTime: string = '';

  interval: any;

  language: number = 0;

  willShowAlertMessage:boolean = false;
  alertTitleCN: string = '';
  alertTitleEN: string = '';
  alertBodyCN: string = '';
  alertBodyEN: string = '';

  now = 0;

  waiting: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.unitData = environment.unitData;

    this.account = new Account(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.now = Math.floor((new Date()).getTime() / 1000);
    this.interval = setInterval(() => {
      this.now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
      this.showNextRecover();
    } ,300);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  goBack() {
    this.onGoBack.emit();
  }

  getItemImage(unit, index) {
    if (unit.mounted[index]) {
      return environment.itemData[unit.mounted[index]].imagePath;
    } else {
      return [
        '/assets/images/weapon.png',
        '/assets/images/armor.png',
        '/assets/images/accessory.png',
        '/assets/images/helmet.png'
      ][index];
    }
  }

  doGearMount(unit, index) {
    this.itemIdMounted = unit.mounted[index];
    this.itemRIdMounted = 0;
    this.profile.items.forEach(item => {
      if (item.mountedByUnitId == unit.unitId && item.positionIndex == index) {
        this.itemRIdMounted = item.rId;
      }
    });

    this.unitIdToMount = unit.unitId;
    this.positionIndexToMount = index;

    this.showGearMount = true;
  }

  upgrade(index: number, unitId: number) {
    this.waiting = true;
    this.contractService.upgrade(unitId).then(result => {
      this.refreshLevel(index, unitId, result);
      this.waiting = false;

      this.alertTitleCN = '恭喜您';
      this.alertTitleEN = 'Succeeded';
      this.alertBodyCN = '升级成功。';
      this.alertBodyEN = 'Level Up.';
      this.willShowAlertMessage = true;
    }, err => {
      this.waiting = false;

      this.alertTitleCN = '升级失败';
      this.alertTitleEN = 'Failed to upgrade';

      if (err.indexOf('gas not enough') >= 0) {
        this.alertBodyCN = 'Gas不足, 请通过抵押获得更多';
        this.alertBodyEN = 'Your don\'t have enough gas, please pledge IOST to get more';
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.alertBodyCN = '三国币数量不足';
        this.alertBodyEN = 'You need more SGT to upgrade';
      } else {
        this.alertBodyCN = err;
        this.alertBodyEN = err;
      }

      this.willShowAlertMessage = true;
    });
  }

  unlockLevel(index: number, unitId: number, level: number) {
    this.waiting = true;
    this.contractService.unlockLevel(unitId, level).then(rIdArray => {
      this.profile['units'][index].unlock = level;

      this.waiting = false;

      this.profile.items = this.profile.items.filter(item => rIdArray.indexOf(item.rId) < 0);

      this.alertTitleCN = '恭喜您';
      this.alertTitleEN = 'Succeeded';
      this.alertBodyCN = '突破成功。';
      this.alertBodyEN = 'Level Unlocked.';
      this.willShowAlertMessage = true;
    }, err => {
      this.waiting = false;

      this.alertTitleCN = '突破失败';
      this.alertTitleEN = 'Failed to Unlock';

      if (err.indexOf('gas not enough') >= 0) {
        this.alertBodyCN = 'Gas不足, 请通过抵押获得更多';
        this.alertBodyEN = 'Your don\'t have enough gas, please pledge IOST to get more';
      } else if (err.indexOf('not enough item')) {
        if (level == 10) {
          this.alertBodyCN = '需要道符1个。请先合成它（金，银，象牙）。';
          this.alertBodyEN = '1 Dao Amulet is needed. Please synthesize it first (gold, silver, and ivory).';
        } else if (level == 15) {
          this.alertBodyCN = '需要道符2个。请先合成它（金，银，象牙）。';
          this.alertBodyEN = '2 Dao Amulet is needed. Please synthesize it first (gold, silver, and ivory).';
        } else if (level >= 20 && level <= 24) {
          this.alertBodyCN = '需要道符2个和翡翠锦囊1个。请先合成它们（金，银，象牙，绿宝石）。';
          this.alertBodyEN = '2 Dao Amulet and 1 Emerald Amulet is needed. Please synthesize it first (gold, silver, ivory, Emerald).';
        }
      } else {
        this.alertBodyCN = err;
        this.alertBodyEN = err;
      }

      this.willShowAlertMessage = true;
    });
  }

  recover(index: number, unitId: number) {
    this.waiting = true;
    this.contractService.recover(
        unitId, this.profile.units[index].recoverCost).then(res => {

      this.waiting = false;

      if (res.unitId > 0) {
        this.refreshEnergy(index, unitId);

        this.alertTitleCN = '恭喜您';
        this.alertTitleEN = 'Succeeded';

        if (res.ticketAmount > 0) {
          this.alertBodyCN = '体力恢复成功，并获得抽奖机会' + res.ticketAmount + '次。';
          this.alertBodyEN = 'Stamina recovered, and got ' + res.ticketAmount + ' lottery tickets.'
        } else {
          this.alertBodyCN = '体力恢复成功。';
          this.alertBodyEN = 'Stamina recovered.';
        }
      } else {
        this.alertTitleCN = '体力恢复失败';
        this.alertTitleEN = 'Failed to recover';

        this.alertBodyCN = '此英雄今天已经超过了3次的恢复上限。请明天再试。';
        this.alertBodyEN = 'You have alreadyrecovered this hero for 3 times today. Please come back tomorrow.';
      }

      this.willShowAlertMessage = true;
    }, err => {
      this.waiting = false;

      this.alertTitleCN = '体力恢复失败';
      this.alertTitleEN = 'Failed to recover';

      if (err.indexOf('balance not enough') >= 0) {
        this.alertBodyCN = '您钱包中的IOST余额不足';
        this.alertBodyEN = 'You don\'t have enough IOST';
      } else if (err.indexOf('gas not enough') >= 0) {
        this.alertBodyCN = 'Gas不足, 请通过抵押获得更多';
        this.alertBodyEN = 'Your don\'t have enough gas, please pledge IOST to get more';
      } else {
        this.alertBodyCN = err;
        this.alertBodyEN = err;
      }

      this.willShowAlertMessage = true;
    });
  }

  refreshEnergy(index: number, unitId: number) {
    this.profile['units'][index]['energy']['amount'] = 10;
    this.profile['units'][index]['energy']['duration'] = 0;
    this.account.getNow().then(now => {
      this.profile['units'][index]['energy']['now'] = now;
    });

    this.unitManager.canRecover(this.now, unitId).then(res => {
      this.profile['units'][index]['energy']['canRecover'] = res;
    });
  }

  showNextRecover() {
    const left = 3600 * 24 - this.now % (3600 * 24);

    if (left <= 0) {
      this.profile.units.forEarch(unit => {
        unit['energy']['canRecover'] = true;
      });
    }

    var t;

    if (left < 60) {
      t = [
        left + '秒',
        left + ' sec'
      ][this.language];
    } else if (left < 3600) {
      t = [
        Math.floor(left / 60) + '分',
        Math.floor(left / 60) + ' min'
      ][this.language];
    } else {
      t = [
        Math.floor(left / 3600) + '小时',
        Math.floor(left / 3600) + ' hours'
      ][this.language];
    }

    this.canRecoverTime = t;
  }

  async refreshLevel(index: number, unitId: number, result: any) {
    this.profile['units'][index].level = result.level;
    this.profile['units'][index].hp = result.hp;
    this.profile['units'][index].attack = result.attack;
    this.profile['units'][index].defense = result.defense;
    this.profile['units'][index].intelligence = result.intelligence;
    this.profile['units'][index].agility = result.agility;
    this.profile['units'][index].luck = result.luck;
    this.profile['units'][index].recoverCost = result.recoverCost;
    this.profile['units'][index].upgradeCost = result.upgradeCost;

    this.profile['balance'] = await this.treasureManager.getMyBalance();;
  }

  fillEnergyInBatch() {
    this.showFillEnergy = true;
  }

  onBatchRecover($event: any) {
    const unitIdArray = $event.unitIdArray;

    unitIdArray.map((unitId) => {
      let index = 0;
      for (let i = 0; i < this.profile.units.length; ++i) {
        if (this.profile.units[i].unitId == unitId) {
          index = i;
          break;
        }
      }

      this.refreshEnergy(index, unitId);
    });

    this.showFillEnergy = false;
  }

  onClose() {
    this.showFillEnergy = false;
    this.showGearMount = false;
    this.willShowAlertMessage = false;
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return (x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return (x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return (x / 1000.0).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return (x / 1000.0).toFixed(1) + ' K';
    } else if (x >= 10) {
      return (x * 1).toFixed(0);
    } else if (x >= 1) {
      if (x == Math.floor(x * 1)) {
        return (x * 1).toFixed(0);
      } else {
        return +(x * 1).toFixed(1);
      }
    } else if (x > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
  }

  changeLanguage(language: number) {
    this.language = language;
    
    if (this.playerFillEnergy) {
      this.playerFillEnergy.changeLanguage(language);
    } 

    if (this.gearMount) {
      this.gearMount.changeLanguage(language);
    } 

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  showEnergy(index: number, now: number) {
    const duration = this.profile.units[index].energy.duration + (now - this.profile.units[index].energy.now);
    const amount = this.profile.units[index].energy.amount + Math.floor(duration / 3600);
    return Math.min(10, amount);
  }

  showTime(index: number, now: number) {
    const duration = this.profile.units[index].energy.duration + (now - this.profile.units[index].energy.now);
    const r = 3600 - duration % 3600;
    const m = Math.floor(r / 60);
    const s = r % 60;
    return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
  }
}
