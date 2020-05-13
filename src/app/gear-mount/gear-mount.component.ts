import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';
import { UnitManager } from '../unit-manager';


@Component({
  selector: 'app-gear-mount',
  templateUrl: './gear-mount.component.html',
  styleUrls: ['./gear-mount.component.css']
})
export class GearMountComponent implements OnInit {

  @Input() profile: any;
  @Input() unitId: number;
  @Input() itemId: number;
  @Input() itemRId: number;
  @Input() positionIndex: number;

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  currentLevel: number = 0;
  currentScore: number = 0;
  useableCount: number = 0;

  itemRIdArray: Array<number> = [];

  now: number = 0;
  interval: any;

  waiting: boolean = false;

  selectedItemRId: number = 0;

  itemManager: any = null;
  unitManager: any = null;

  unitData: any = {};
  itemData: any = {};

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.unitData = environment.unitData;
    this.itemData = environment.itemData;

    this.profile.items.forEach(item => {
      if (this.itemId && this.itemRId) {
        if (item.rId == this.itemRId) {
          this.currentLevel = item.level;
          this.currentScore = item.score;
        }
      }

      if (item.isMountable && item.positionIndex == this.positionIndex) {
        ++this.useableCount;
      }
    });

    // TODO: move now to profile.
    this.now = Math.floor((new Date()).getTime() / 1000);
    this.interval = setInterval(() => {
      this.now = Math.floor((new Date()).getTime() / 1000) - this.profile.timeD;
    }, 300);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
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
      10: 24
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
      10: 24
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

  mountItem() {
    if (this.useableCount == 0 || this.selectedItemRId == 0) {
      return;
    }

    var mountedByUnitId = 0;
    this.profile.items.forEach(item => {
      if (item.rId == this.selectedItemRId) {
        mountedByUnitId = item.mountedByUnitId;
      }
    });

    this.waiting = true;
    this.contractService.mountItem(this.selectedItemRId, this.unitId).then(oldItemRId => {
      this.profile.items.forEach(item => {
        if (item.rId == this.selectedItemRId) {
          item.mountedByUnitId = this.unitId;
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
      this.unitManager.getMyOneUnit(this.itemManager, this.unitId).then(updatedUnit => {
        this.profile.units.forEach((unit, i) => {
          if (unit.unitId == this.unitId) {
            this.profile.units[i] = updatedUnit;
          }
        });
      });
      if (mountedByUnitId) {
        this.unitManager.getMyOneUnit(this.itemManager, mountedByUnitId).then(updatedUnit => {
          this.profile.units.forEach((unit, i) => {
            if (unit.unitId == mountedByUnitId) {
              this.profile.units[i] = updatedUnit;
            }
          });
        });
      }

      this.waiting = false;

      this.showAlert('装备成功', 'Successfully mounted',
          '', '');
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

      this.waiting = false;
    });
  }

  unmountItem() {
    this.waiting = true;
    this.contractService.unmountItem(this.itemRId).then(_ => {
      // Updates profile.
      const itemArray = this.profile.items.filter(item => {
        return item.rId == this.itemRId;
      });

      if (itemArray.length > 0) {
        itemArray[0].mountedByUnitId = 0;

        // Refresh units because mount/unmount happened.
        this.unitManager.getMyOneUnit(this.itemManager, this.unitId).then(updatedUnit => {
          this.profile.units.forEach((unit, i) => {
            if (unit.unitId == this.unitId) {
              this.profile.units[i] = updatedUnit;
            }
          });
        });
      }

      this.waiting = false;

      this.showAlert('卸载成功', 'Successfully unmounted',
          '', '');
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

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  close() {
    this.onClose.emit();
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
    this.onClose.emit();
  }
}
