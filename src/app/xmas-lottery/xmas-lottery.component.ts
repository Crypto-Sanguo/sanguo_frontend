import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  
import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import {LotteryManager} from '../lottery-manager';

import * as moment from 'moment';

@Component({
  selector: 'app-xmas-lottery',
  templateUrl: './xmas-lottery.component.html',
  styleUrls: ['./xmas-lottery.component.css']
})
export class XmasLotteryComponent implements OnInit {

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  lotteryManager: any = null;

  tabIndex: number = 0;
  results: Array<any> = [];
  queue: Array<any> = [];

  waiting: boolean = false;
  waitingForData: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.lotteryManager = new LotteryManager(this.contractService.myIOST);

    this.load();
  }

  drawWithTicket() {
    this.waiting = true;

    this.contractService.drawWithTicket().then(async _ => {
      alert('已经进入队列. You are in queue now');

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        alert('Gas不足. Gas not enough');
      } else {
        alert('出错了. System Error.');
      }

      this.waiting = false;
    });
  }

  drawWithIOST() {
    this.waiting = true;

    this.contractService.drawWithIOST().then(async _ => {
      alert('已经进入队列. You are in queue now');
      
      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        alert('Gas不足. Gas not enough');
      } else {
        alert('出错了. System Error.');
      }
      
      this.waiting = false;
    });
  }

  load() {
    this.showTab(this.tabIndex);
  }

  async showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    if (tabIndex == 0) {
      this.results = [];
      this.results = await this.lotteryManager.getXMasResults();
    } else {
      this.queue = [];
      this.queue = await this.lotteryManager.getXMasQueue();
    }
  }

  itemName(itemId: number) {
    return [environment.itemData[itemId].nameCN, environment.itemData[itemId].nameEN];
  }

  unitName(unitId: number) {
    return [environment.unitData[unitId].nameCN, environment.unitData[unitId].nameEN];
  }

  timeAsCN(time: number) {
    return moment(time.toString(), 'X').locale('zh-cn').fromNow();
  }

  timeAsEN(time: number) {
    return moment(time.toString(), 'X').locale('us-en').fromNow();
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit();
  }
}
