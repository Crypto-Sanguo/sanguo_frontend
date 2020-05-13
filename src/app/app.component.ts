import { Component, OnInit, ViewChild } from '@angular/core';

import { ContractService } from './contract.service';
import { GateService } from './gate.service';

import { environment } from '../environments/environment';

import { Account } from './account';
import { ItemManager } from './item-manager';
import { NotificationManager } from './notification-manager';
import { StageManager } from './stage-manager';
import { TreasureManager } from './treasure-manager';
import { UnitManager } from './unit-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('topBar') topBar;
  @ViewChild('bottomBar') bottomBar;
  @ViewChild('dashboard') dashboard;
  @ViewChild('rightSide') rightSide;

  tabId: number = 0;

  account: any = null;
  itemManager: any = null;
  notificationManager: any = null;
  stageManager: any = null;
  treasureManager: any = null;
  unitManager: any = null;

  showStatus: boolean = true;
  waiting: boolean = false;

  willShowWechatBox: boolean = false;

  profile: any = {
  };

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.load();

    let language: number = parseInt(localStorage.getItem('language'));
    
    if (isNaN(language)) {
      localStorage.setItem('language', '0');
    }
  }

  async load() {
    this.waiting = true;

    const walletReady = await this.contractService.init();

    this.account = new Account(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.notificationManager = new NotificationManager(this.contractService.myIOST);
    this.stageManager = new StageManager(this.contractService.myIOST);
    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.profile = {};

    if (walletReady) {
      this.profile.walletReady = true;

      this.profile.hasStarted = await this.account.hasStarted();
      this.profile.stages = [];
      this.profile.units = [];
      this.profile.unitsLoading = true;
      this.profile.items = [];
      this.profile.itemsLoading = true;
      this.profile.notifications = [];
      this.profile.notificationsLoading = true;
      this.profile.stat = {};
      this.profile.balance = 0;
      this.profile.dividend = 0;
      this.profile.defense = [0, 0, 0];
      this.profile.now = Math.floor((new Date()).getTime() / 1000);

      if (!this.profile.hasStarted) {
        this.waiting = false;
        return;
      }

      var all = [];
      all.push(environment.stageIdArray.map(async (stageId, i) => {
        this.profile.stages[i] = await this.stageManager.getStage(this.unitManager, stageId);
      }));
      all.push((async () => {
        this.profile.stat = await this.unitManager.getMyValues(this.gateService);
      }) ());
      all.push((async () => {
        this.profile.balance = await this.treasureManager.getMyBalance();
      }) ());
      all.push((async () => {
        this.profile.defense = await this.unitManager.getDefenseUnitIdArray();
      }) ());

      await Promise.all(all);

      setTimeout(() => {
        if (this.dashboard) {
          this.dashboard.onStart();
        }
      }, 200);

      this.waiting = false;

      setTimeout(async () => {
        this.profile.units = await this.unitManager.getMyUnits(this.itemManager);
        this.profile.unitsLoading = false;
      }, 0);
      setTimeout(async () => {
        this.profile.items = await this.itemManager.getMyItems();
        this.profile.items.sort((a, b) => b.itemId - a.itemId);
        this.profile.itemsLoading = false;
      }, 0);
      setTimeout(async () => {
        this.profile.notifications = await this.notificationManager.getNotifications();
        this.profile.notificationsLoading = false;
      }, 0);

      this.profile.now = await this.account.getNow();
      this.profile.timeD = Math.floor((new Date()).getTime() / 1000 - this.profile.now);

      // To speed up synthesizing.

      setTimeout(async () => {
        this.profile.itemTemplates = {};

        all = [];

        for (let itemId in environment.itemData) {
          all.push((async (itemId) => {
            this.profile.itemTemplates[itemId] = await this.itemManager.getItem(itemId);
          }) (itemId));
        }

        await Promise.all(all);
      }, 0);

      setTimeout(async () => {
        this.profile.dividend = await this.treasureManager.getDividendValue();
      }, 0);
    } else {
      this.profile.walletReady = false;
      this.profile.hasStarted = false
      this.profile.stages = [];
      this.profile.units = [];
      this.profile.unitsLoading = false;
      this.profile.items = [];
      this.profile.itemsLoading = false;
      this.profile.stat = {};
      this.profile.balance = 0;
      this.profile.dividend = 0;
      this.profile.defense = [0, 0, 0];
      this.profile.now = Math.floor((new Date()).getTime() / 1000);
      this.profile.now = await this.account.getNow();
      this.profile.timeD = Math.floor((new Date()).getTime() / 1000 - this.profile.now);

      this.waiting = false;
    }
  }

  gotoTab($event: any) {
    this.tabId = $event.tabId;
  }

  topBarGotoTab($event: any) {
    this.topBar.gotoTab($event.tabId);
  }

  refreshEnergy($event: any) {
  }

  onRefreshDashboard($event: any) {
    this.dashboard.refresh($event);
  }

  onRefreshBottomBar($event: any) {
    this.bottomBar.refresh();
  }

  onToggleStatus($event: any) {
    this.showStatus = $event.showStatus;
  }

  showWechatBox() {
    this.willShowWechatBox = true;
  }

  closeWechatBox() {
    this.willShowWechatBox = false;
  }

  onSetTeams($event) {
    if (this.topBar) {
      this.topBar.toggleStatus();
    }
    if (this.dashboard) {
      this.dashboard.gotoTeams($event.tabIndex);
    }
  }

  changeLanguageByEvent($event: any) {
    this.changeLanguage($event.language);
  }

  changeLanguage(language: number) {
    if (this.topBar) {
      this.topBar.changeLanguage(language);
    }

    if (this.bottomBar) {
      this.bottomBar.changeLanguage(language);
    }

    if (this.dashboard) {
      this.dashboard.changeLanguage(language);
    }

    if (this.rightSide) {
      this.rightSide.changeLanguage(language);
    }
  }
}
