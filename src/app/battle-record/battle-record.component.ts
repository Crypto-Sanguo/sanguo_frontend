import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { BattleManager } from '../battle-manager';
import { LandManager } from '../land-manager';

import { environment } from '../../environments/environment';

import * as moment from 'moment';


@Component({
  selector: 'app-battle-record',
  templateUrl: './battle-record.component.html',
  styleUrls: ['./battle-record.component.css']
})
export class BattleRecordComponent implements OnInit {
  @ViewChild('alertMessage') alertMessage;

  @Input() profile: any;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  battleManager: any = null;
  landManager: any = null;

  waitingForHistory: boolean = false;
  history: Array<any> = [];

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.battleManager = new BattleManager(this.contractService.myIOST);
    this.landManager = new LandManager(this.contractService.myIOST);

    this.loadRecentRecords();

    this.language = parseInt(localStorage.getItem('language'));
  }

  loadRecentRecords() {
    this.waitingForHistory = true;
    this.battleManager.getHistory().then(history => {
      this.history = history.slice(history.length - 20, history.length);

      this.waitingForHistory = false;
    }, err => {
      this.waitingForHistory = false;
    });
  }

  timeAsCN(time: number) {
    return moment(time.toString(), 'X').locale('zh-cn').fromNow();
  }

  timeAsEN(time: number) {
    return moment(time.toString(), 'X').locale('us-en').fromNow();
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

  async showUserLandInfo(who: string) {
    this.showAlert('土地信息', 'Land Information', '加载中...', 'Loading...');
    const info = await this.landManager.getUserLandInfo(who);

    let txtCN = '';
    let txtEN = '';

    for (let landId in info) {
      const cityId = info[landId];

      txtCN += '#' + landId + ': ' + this.cityIdToCityName(cityId)[0] + '\n';
      txtEN += '#' + landId + ': ' + this.cityIdToCityName(cityId)[1] + '\n';
    }

    this.showAlert('土地信息', 'Land Information', txtCN, txtEN);
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

  changeLanguage(language: number) {
    this.language = language;
  }
}
