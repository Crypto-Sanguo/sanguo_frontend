import { Component, Input, OnInit } from '@angular/core';

import { ContractService } from '../contract.service';
import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

import { LandManager } from '../land-manager';
import { UnitManager } from '../unit-manager';


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  @Input() profile: any;

  tabIndex: number = 0;

  unitManager: any = null;
  landManager: any = null;

  unitData: any;

  peerArray:Array<any> = [];
  page: number = 0;
  sortBy: string = 'score';
  hasNext: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  myRank: string = '';
  waiting: boolean = false;

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.unitManager = new UnitManager(this.contractService.myIOST);
    this.landManager = new LandManager(this.contractService.myIOST);

    this.unitData = environment.unitData;

    this.showTab(0);
  }

  showTab(index: number) {
    this.tabIndex = index;

    if (index == 0) {
      this.sortBy = 'power';
    } else if (index == 1) {
      this.sortBy = 'score';
    } else if (index == 2) {
      this.sortBy = 'balance';
    } else if (index == 3) {
      this.sortBy = 'revenue';
    } else if (index == 4) {
      this.sortBy = 'spending';
    } else {
      this.sortBy = 'profit';
    }

    this.loadPage(0);
  }

  async loadPage(page: number) {
    this.page = page;
    await this._loadPage();
    this.myRank = this.profile.stat['rank_' + this.sortBy];
  }

  async _loadPage() {
    this.waiting = true;
    this.peerArray = [];

    const oldSortBy = this.sortBy + "";

    const peerArray = await this.unitManager.getPeersAndUpdateMyStat(this.gateService, this.sortBy, 21, this.page * 20, this.profile.stat);

    if (this.sortBy == oldSortBy) {
      // In case user changed tab when loading.
      this.peerArray = peerArray.slice(0, 20);
      this.waiting = false;
      this.hasNext = peerArray.length > 20;
    }
  }

  formatNumber(x: number) {
    const aX = Math.abs(x);
    if (aX >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (aX >= 1000000000) {
      return +(x / 1000000000).toFixed(1) + ' B';
    } else if (aX >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (aX >= 1000000) {
      return +(x / 1000000).toFixed(1) + ' M';
    } else if (aX >= 10000) {
      return (x / 1000.0).toFixed(0) + ' K';
    } else if (aX >= 1000) {
      return +(x / 1000.0).toFixed(1) + ' K';
    } else if (aX > 10) {
      return +(x * 1).toFixed(1);
    } else if (aX > 1) {
      return +(x * 1).toFixed(2);
    } else if (aX > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
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
