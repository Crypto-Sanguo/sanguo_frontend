import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';
import { TreasureManager } from '../treasure-manager';
import { UnitManager } from '../unit-manager';


@Component({
  selector: 'app-player-gear',
  templateUrl: './player-gear.component.html',
  styleUrls: ['./player-gear.component.css']
})
export class PlayerGearComponent implements OnInit {
  
  @ViewChild('playerRecycle') playerRecycle;
  @ViewChild('playerGearSelection') playerGearSelection;
  @ViewChild('gearSell') gearSell;
  @ViewChild('gearUpgrade') gearUpgrade;
  @ViewChild('gearRecycle') gearRecycle;
  @ViewChild('gearCooldown') gearCooldown;
  @ViewChild('synthesise') synthesise;
  @ViewChild('marketItemInfo') marketItemInfo;
  @ViewChild('gearFilter') gearFilter;
  @ViewChild('alertMessage') alertMessage;

  @Input() profile: any;
  @Output() onGoBack: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshUnits: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshItems: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();

  showRecycleGear = false;

  language: number = 0;

  itemData: any = null;
  unitData: any = null;

  itemManager: any = null;
  treasureManager: any = null;
  unitManager: any = null;

  willShowGearSell: boolean = false;

  willShowGearSelection: boolean = false;
  selectedItemRId: number = 0;

  willShowGearRecycle: boolean = false;
  recycleItemId: number = 0;
  recycleItemWorth: number = 0;
  recycleItemRId: number = 0;

  willShowGearCooldown: boolean = false;
  itemInCooldown: any;

  itemToUpgrade: any = null;
  showGearUpgrade: boolean = false;

  showSynthesise: boolean = false;

  willShowMarketItemInfo = false;
  itemInfoRId: number = 0;

  willShowGearFilter = false;

  now: number = 0;
  waiting: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  filterValue: number = 0;

  interval: any;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.itemData = environment.itemData;
    this.unitData = environment.unitData;

    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    // TODO: move now to profile.
    this.now = Math.floor((new Date()).getTime() / 1000);
    this.interval = setInterval(() => {
      this.now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
    }, 300);

    this.language = parseInt(localStorage.getItem('language'));
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  goBack() {
    this.onGoBack.emit();
  }

  mountItem(itemRId: number) {
    this.willShowGearSelection = true;
    this.selectedItemRId = itemRId;
  }

  onSelect($event: any) {
    this.contractService.mountItem(this.selectedItemRId, $event.unitId).then(oldItemRId => {
      this.willShowGearSelection = false;

      this.profile.items.forEach(item => {
        if (item.rId == this.selectedItemRId) {
          item.mountedByUnitId = $event.unitId;
        } else if (item.rId == oldItemRId){
          item.mountedByUnitId = 0;
        }
      });

      // To upgrade CD.
      this.itemManager.getOneItem(this.selectedItemRId).then(updatedItem => {
        this.profile.items.forEach((item, i) => {
          if (item.rId == this.selectedItemRId) {
            this.profile.items[i] = updatedItem;
          }
        });
      });

      // Refresh units because mount/unmount happened.
      this.unitManager.getMyOneUnit(this.itemManager, $event.unitId).then(updatedUnit => {
        this.profile.units.forEach((unit, i) => {
          if (unit.unitId == $event.unitId) {
            this.profile.units[i] = updatedUnit;
          }
        });
      });
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('need cooldown') >= 0) {
        this.showAlert('冷却中', 'In Cooldown',
            '请稍等或者付费解锁', 'Please wait or pay SGT');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.willShowGearSelection = false;
    });
  }

  gotoSynthesise() {
    this.showSynthesise = true;
  }

  onClose() {
    this.willShowGearSell = false;
    this.willShowGearSelection = false;
    this.willShowGearRecycle = false;
    this.willShowGearCooldown = false;
    this.showRecycleGear = false;
    this.showGearUpgrade = false;
  }

  unmountItem(itemRId: number) {
    this.waiting = true;
    this.contractService.unmountItem(itemRId).then(hash => {
      // Updates profile.
      const itemArray = this.profile.items.filter(item => {
        return item.rId == itemRId;
      });

      if (itemArray.length > 0) {
        const unitId = itemArray[0].mountedByUnitId;
        itemArray[0].mountedByUnitId = 0;

        // Refresh units because mount/unmount happened.
        this.unitManager.getMyOneUnit(this.itemManager, unitId).then(updatedUnit => {
          this.profile.units.forEach((unit, i) => {
            if (unit.unitId == unitId) {
              this.profile.units[i] = updatedUnit;
            }
          });
        });
      }

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  inCooldown(item: any) {
    const h = {
      1: 0,
      2: 2,
      3: 4,
      4: 10,
      5: 24,
      6: 24,
      7: 24,
      8: 24,
      9: 24,
      10: 24,
      11: 24,
      12: 24,
      13: 24,
      14: 24,
      15: 24
    }[item.level];
    const left = 3600 * h + item.time - this.now;
    return left >= 0;
  }

  showCooldown(item: any) {
    const h = {
      1: 0,
      2: 2,
      3: 4,
      4: 10,
      5: 24,
      6: 24,
      7: 24,
      8: 24,
      9: 24,
      10: 24,
      11: 24,
      12: 24,
      13: 24,
      14: 24,
      15: 24
    }[item.level];
    const left = 3600 * h + item.time - this.now;

    if (left <= 0) {
      return '';
    }

    if (left < 60) {
      return [
        left + '秒',
        left + ' sec'
      ][this.language];
    } else if (left < 3600) {
      return [
        Math.floor(left / 60) + '分',
        Math.floor(left / 60) + ' min'
      ][this.language];
    } else {
      return [
        Math.floor(left / 3600) + '小时' + Math.floor((left % 3600) / 60) + '分',
        Math.floor(left / 3600) + ' H ' + Math.floor((left % 3600) / 60) + ' M'
      ][this.language];
    }
  }

  recycle(itemId: number, itemRId: number) {
    this.willShowGearRecycle = true;
    this.recycleItemId = itemId;

    this.recycleItemWorth = this.profile.items.filter(item => {
      return item.rId == itemRId;
    })[0].worth;

    this.recycleItemRId = itemRId;
  }

  clearCooldown(item: any) {
    this.willShowGearCooldown = true;
    this.itemInCooldown = item;
  }

  recycleGearInBatch() {
    this.showRecycleGear = true;
  }

  upgradeItem(item: any) {
    this.itemToUpgrade = item;
    this.showGearUpgrade = true;
  }

  onRecycle($event: any) {
    this.waiting = true;
    this.contractService.recycleItem(this.recycleItemRId).then(balance => {
      this.willShowGearRecycle = false;

      this.profile.items = this.profile.items.filter(item => {
        return item.rId != this.recycleItemRId
      });

      this.treasureManager.getMyBalance().then(balance => {
        this.profile.balance = balance;
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  onClearCooldown() {
    this.waiting = true;
    this.contractService.clearCooldown(this.itemInCooldown.rId).then(_ => {
      this.willShowGearCooldown = false;

      this.profile.items.forEach(item => {
        if (item.rId == this.itemInCooldown.rId) {
          item.time = 0;
        }
      });

      this.treasureManager.getMyBalance().then(balance => {
        this.profile.balance = balance;
      });

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  sellInBatch() {
    this.willShowGearSell = true;
  }

  changeLanguage(language: number) {
    this.language = language;
    
    if (this.playerRecycle) {
      this.playerRecycle.changeLanguage(language);
    }

    if (this.playerGearSelection) {
      this.playerGearSelection.changeLanguage(language);
    }

    if (this.gearSell) {
      this.gearSell.changeLanguage(language);
    }

    if (this.gearRecycle) {
      this.gearRecycle.changeLanguage(language);
    }

    if (this.gearCooldown) {
      this.gearCooldown.changeLanguage(language);
    }

    if (this.gearUpgrade) {
      this.gearUpgrade.changeLanguage(language);
    }

    if (this.synthesise) {
      this.synthesise.changeLanguage(language);
    }

    if (this.marketItemInfo) {
      this.marketItemInfo.changeLanguage(language);
    }

    if (this.gearFilter) {
      this.gearFilter.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  maybeReload() {
    if (this.synthesise) {
      this.synthesise.reloadData();
    }
  }

  refreshItems($event: any) {
    this.onRefreshItems.emit();
  }

  refreshBottomBar($event: any) {
    this.onRefreshBottomBar.emit();
  }

  showMarketItemInfo(itemRId: number) {
    this.willShowMarketItemInfo = true;
    this.itemInfoRId = itemRId;
  }

  closeMarketItemInfo() {
    this.willShowMarketItemInfo = false;
  }

  showGearFilter() {
    this.willShowGearFilter = true;
  }

  closeGearFilter() {
    this.willShowGearFilter = false;
  }

  filter($event) {
    if ($event.sortBy == 0) {
      this.profile.items.sort((a, b) => {
        if (a.isMountable && !b.isMountable) {
          return -1;
        }

        if (!a.isMountable && b.isMountable) {
          return 1;
        }

        return b.itemId - a.itemId
      });
    } else if ($event.sortBy == 1) {
      this.profile.items.sort((a, b) => b.level - a.level);
    } else {
      this.profile.items.sort((a, b) => {
        if (a.isMountable && !b.isMountable) {
          return -1;
        }

        if (!a.isMountable && b.isMountable) {
          return 1;
        }

        if (a.isMountable && b.isMountable) {
          return b.score - a.score;
        } else {
          return b.itemId - a.itemId;
        }
      });
    }

    this.filterValue = $event.filterBy;

    this.willShowGearFilter = false;
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
}
