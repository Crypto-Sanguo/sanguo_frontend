import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-recycle',
  templateUrl: './player-recycle.component.html',
  styleUrls: ['./player-recycle.component.css']
})
export class PlayerRecycleComponent implements OnInit {
  
  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  totalWorth: number = 0;
  itemRIdArray: Array<number> = [];
  waiting: boolean = false;
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

    this.itemData = environment.itemData;

    for (let i = 0; i < this.profile.items.length; ++i) {
      this.profile.items[i]['checked'] = false;
    }
  }

  toggle(index: number) {
    this.profile.items[index]['checked'] = !this.profile.items[index]['checked'];
    this._reloadData();
  }

  _reloadData() {
    this.itemRIdArray = [];
    this.totalWorth = 0;

    for (let i = 0; i < this.profile.items.length; ++i) {
      if (this.profile.items[i]['checked']) {
        this.itemRIdArray.push(this.profile.items[i].rId);
        this.totalWorth += this.profile.items[i].worth;
      }
    }
  }

  recycleInBatch() {
    this.waiting = true;

    this.contractService.recycleInBatch(this.itemRIdArray).then(balance => {
      this.profile.items = this.profile.items.filter(item => {
        return this.itemRIdArray.indexOf(item.rId) < 0;
      });

      this.profile.balance = this.profile.balance * 1 + balance * 1;

      this.waiting = false;
      this.onClose.emit();
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

  selectAllClicked: boolean = false;

  selectAll() {
    this.selectAllClicked = !this.selectAllClicked;

    this.itemRIdArray = [];
    this.totalWorth = 0;

    for (let i = 0; i < this.profile.items.length; ++i) {
      this.profile.items[i]['checked'] = this.selectAllClicked;

      if (this.selectAllClicked) {
        this.itemRIdArray.push(this.profile.items[i].rId);
        this.totalWorth += this.profile.items[i].worth;
      }
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
  }
}
