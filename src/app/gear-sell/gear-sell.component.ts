import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-gear-sell',
  templateUrl: './gear-sell.component.html',
  styleUrls: ['./gear-sell.component.css']
})
export class GearSellComponent implements OnInit {

  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @ViewChild('alertMessage') alertMessage;

  tabIndex: number = 0;

  price: string = "";

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

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;
  }

  toggle(index: number) {
    this.profile.items[index]['checked'] = !this.profile.items[index]['checked'];
    this._reloadData();
  }

  _reloadData() {
    this.itemRIdArray = [];

    for (let i = 0; i < this.profile.items.length; ++i) {
      if (this.profile.items[i]['checked']) {
        this.itemRIdArray.push(this.profile.items[i].rId);
      }
    }
  }

  recycleInBatch() {
    this.waiting = true;

    const priceInNumber = parseInt(this.price) || 0;

    this.contractService.sellItemInBatch(this.itemRIdArray, priceInNumber).then(_ => {
      this.profile.items.forEach(item => {
        if (this.itemRIdArray.indexOf(item.rId) >= 0) {
          item.forSale = 1;
        }
      });

      this.showAlert('挂单成功', 'Order is sent', '', '');
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
