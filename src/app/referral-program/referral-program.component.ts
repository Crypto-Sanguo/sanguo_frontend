import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { TreasureManager } from '../treasure-manager';

@Component({
  selector: 'app-referral-program',
  templateUrl: './referral-program.component.html',
  styleUrls: ['./referral-program.component.css']
})
export class ReferralProgramComponent implements OnInit {

  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  language: number = 0;

  waiting: boolean = false;

  teamInfo: Array<any> = [];
  hasMore: boolean = false;
  currentPage: number = 1;

  tier: number = 0;
  bonus: number = 0;

  treasureManager: any = null;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.treasureManager = new TreasureManager(this.contractService.myIOST);

    this.treasureManager.getReferralBonus().then(bonus => {
      this.bonus = bonus;
    });

    this.gotoPage(1);

    this.language = parseInt(localStorage.getItem('language'));
  }

  withdraw() {
    this.waiting = true;

    this.contractService.withdrawReferralBonus().then(_ => {
      this.showAlert('提币成功', 'Withdrawal is done', '', '');
      this.bonus = 0;

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

  showTier(tier: number) {
    this.tier = tier;
    this.gotoPage(1);
  }

  async gotoPage(page: number) {
    this.currentPage = page;
    const team = await this.treasureManager.getMyTeam(this.tier);

    this.teamInfo = team.slice((page - 1) * 10, page * 10).map(who => {
      const res = {
        name: who,
        amount: 0
      };

      this.treasureManager.getReferralSpent(who).then(amount => {
        res.amount = +(amount * [
          0.5,
          0.309,
          0.191
        ][this.tier]).toFixed(2);
      });

      return res;
    });

    this.hasMore = team.length >= page * 10;
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

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }
}
