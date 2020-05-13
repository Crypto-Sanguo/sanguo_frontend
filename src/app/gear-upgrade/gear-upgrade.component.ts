import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-upgrade',
  templateUrl: './gear-upgrade.component.html',
  styleUrls: ['./gear-upgrade.component.css']
})
export class GearUpgradeComponent implements OnInit {

  @Input() item: any;
  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  selectedRId: number = 0;
  cost: number = 0;
  sameItems: Array<any> = [];
  waiting: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this._reloadData();
  }

  _reloadData() {
    this.sameItems = [];
    this.cost = this.item.worth;

    for (let i = 0; i < this.profile.items.length; ++i) {
      if (this.profile.items[i].itemId == this.item.itemId &&
          this.profile.items[i].level == this.item.level &&
          this.profile.items[i].rId != this.item.rId &&
          this.profile.items[i].mountedByUnitId == 0) {
        this.sameItems.push({
          nameCN: environment.itemData[this.item.itemId].nameCN,
          nameEN: environment.itemData[this.item.itemId].nameEN,
          rId: this.profile.items[i].rId,
          level: this.profile.items[i].level,
          score: this.profile.items[i].score
        });

        if (this.selectedRId == 0) {
          this.selectedRId = this.profile.items[i].rId;
        }
      }
    }
  }

  upgrade(rIdB) {
    this.waiting = true;

    var selectedScore = 0;
    for (let i = 0; i < this.sameItems.length; ++i) {
      if (this.sameItems[i].rId == this.selectedRId) {
        selectedScore = this.sameItems[i].score;
        break;
      }
    }

    this.contractService.upgradeItem(this.item.rId, this.selectedRId).then(_ => {
      this.profile.items = this.profile.items.filter(item => {
        return item.rId != this.selectedRId;
      });

      this.profile.balance = this.profile.balance * 1 - this.cost * 1;
      this.item.score = Math.max(this.item.score, selectedScore);
      this.item.level += 1;

      this.showAlert('升级成功', 'Successfully upgraded', '', '');

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'You need more SGT', '', '');
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
