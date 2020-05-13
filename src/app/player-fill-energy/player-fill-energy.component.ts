import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-fill-energy',
  templateUrl: './player-fill-energy.component.html',
  styleUrls: ['./player-fill-energy.component.css']
})
export class PlayerFillEnergyComponent implements OnInit {

  @ViewChild('alertMessage') alertMessage;
  @Input() profile: any;
  @Output() onComplete: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  totalCost: number = 0;
  unitData: any = {};

  waiting: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  unitIdArrayToRefresh = [];

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.unitData = environment.unitData;

    this.language = parseInt(localStorage.getItem('language'));
    
    // Initialization.
    for (let i = 0; i < this.profile.units.length; ++i) {
      if (this._showEnergy(i) < 5) {
        this.profile.units[i]['checked'] = true;
        this.totalCost += this.profile.units[i].recoverCost * 1;
      } else {
        this.profile.units[i]['checked'] = false;
      }
    }
  }

  _showEnergy(index: number) {
    const now = Math.floor((new Date()).getTime() / 1000);
    const duration = this.profile.units[index].energy.duration + (now - this.profile.units[index].energy.now - this.profile.timeD);
    const amount = this.profile.units[index].energy.amount + Math.floor(duration / 3600);
    return Math.min(5, amount);
  }

  toggle(index: number) {
    this.profile.units[index]['checked'] = !this.profile.units[index]['checked'];

    this.totalCost = 0;
    for (let i = 0; i < this.profile.units.length; ++i) {
      if (this.profile.units[i]['checked']) {
        this.totalCost += this.profile.units[i].recoverCost * 1;
      }
    }
  }

  fill() {
    const unitIdArray = [];

    for (let i = 0; i < this.profile.units.length; ++i) {
      if (this.profile.units[i]['checked']) {
        unitIdArray.push(this.profile.units[i].unitId);
      }
    }

    this.waiting = true;
    this.contractService.recoverInBatch(unitIdArray, this.totalCost).then(res => {
      this.unitIdArrayToRefresh = res.unitIdArray;

      if (res.unitIdArray.length < unitIdArray.length) {
        if (res.ticketAmount > 0) {
          this.showAlert('部分英雄没有被恢复', 'Some heroes are not recovered',
              '单个英雄每天只能被恢复3次。不过，一个好消息是，您获得了' + res.ticketAmount + '次抽奖机会。',
              'There is a limit that a single hero\'s stamina can only be recovered for 3 times per day. But the good news is that you got ' + res.ticketAmount + ' lottery ticket(s).');
        } else {
          this.showAlert('部分英雄没有被恢复', 'Some heroes are not recovered',
              '单个英雄每天只能被恢复3次。我们处理了所有能恢复的英雄',
              'There is a limit that a single hero\'s stamina can only be recovered for 3 times per day. We processed all heroes that are within the limit.');
        }
      } else if (res.ticketAmount > 3) {
        this.showAlert('恭喜您', 'Good news',
            '获得了' + res.ticketAmount + '次抽奖机会。',
            'You got ' + res.ticketAmount + ' lottery ticket(s).');
      } else {
        this.showAlert('恢复成功', 'All heroes are recovered',
            '', '');
      }

      this.waiting = false;
    }, err => {
      this.unitIdArrayToRefresh = [];

      if (err.indexOf('balance not enough') >= 0) {
        this.showAlert('余额不足', 'Balance not enough',
            '您钱包中的IOST余额不足', 'You don\'t have enough IOST');
      } else if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  close() {
    this.onClose.emit();
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

  showAlert(titleCN: string, titleEN: string, bodyCN: string, bodyEN: string) {
    this.alertTitleCN = titleCN;
    this.alertTitleEN = titleEN;
    this.alertBodyCN = bodyCN;
    this.alertBodyEN = bodyEN;
    this.willShowAlertMessage = true;
  }

  closeAlert() {
    this.willShowAlertMessage = false;

    this.onComplete.emit({
      unitIdArray: this.unitIdArrayToRefresh
    });
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }
}
