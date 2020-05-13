import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import RandomCname from 'randomCname';

import { ContractService } from '../contract.service';
import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() profile: any;
  @ViewChild('playerGearSelection') playerGearSelection;
  @ViewChild('playerProfile') playerProfile;
  @ViewChild('playerGear') playerGear;
  @ViewChild('playerTeam') playerTeam;
  @ViewChild('dashboardMessage') dashboardMessage;
  @ViewChild('alertMessage') alertMessage;
  @ViewChild('notification') notification;
  @ViewChild('battleRecord') battleRecord;
  @ViewChild('referralProgram') referralProgram;
  @ViewChild('landLand') landLand;

  @Output() onShowWechatBox: EventEmitter<any> = new EventEmitter();
  @Output() onTopBarGotoTab: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshEnergy: EventEmitter<any> = new EventEmitter();

  referredBy: string = '';
  errorMessage: string = '';

  isLoadingDefense: boolean = false;
  isLoadingTime: boolean = false;

  canEdit: boolean = false;
  willShowSelection:boolean = false;
  selectedIndex:number = 0;

  myRank: string = '';

  showUnits: boolean = false;
  showItems: boolean = false;
  showTeams: boolean = false;
  showTeamsTabIndex: number = 0;

  teamCount: number = 0;

  isLoadingUnits: boolean = false;
  isLoadingItems: boolean = false;

  myKey = 'sg-teams'

  teamArray = [[null, null, null], [null, null, null], [null, null, null]];
  teamStore = [[null, null, null], [null, null, null], [null, null, null]];

  language: number = 0;

  showMessageTitleCN: string = '';
  showMessageTitleEN: string = '';
  showMessageUrlCN: string = '';
  showMessageUrlEN: string = '';
  willShowMessage:boolean = false;
  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  willShowNotification: boolean = false;
  willShowBattleRecord: boolean = false;
  willShowReferralProgram: boolean = false;
  willShowLandLand: boolean = false;

  waiting: boolean = false;

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.loadTeams();

    this.language = parseInt(localStorage.getItem('language'));
  }

  getUrlVars() {
    var vars = {};
    var href: string = window["location"]["href"];
    var parts = href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value):string => {
      vars[key] = value;
      return value;
    });
    return vars;
  }

  getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
      urlparameter = this.getUrlVars()[parameter];
    }
    return urlparameter;
  }

  startGame() {
    this.errorMessage = '';

    this.waiting = true;

    const channel = this.getUrlParam('r', undefined) || 'sg';

    this.contractService.startGame(channel, this.referredBy).then(_ => {
      // this.onStart();
      window['location'].reload();
      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      }

      this.waiting = false;
    });
  }

  onStart() {
  }

  refresh($event: any) {
    if ($event['ranking']) {
    }

    if ($event['units']) {
    }

    if ($event['items']) {
    }
  }

  topBarGotoTab(tabId: number) {
    this.onTopBarGotoTab.emit({tabId: tabId});
  }

  getUnitImagePath(unitId) {
    if (!unitId || !environment.unitData[unitId]) {
      return "/assets/images/bg.png";
    }

    return environment.unitData[unitId].imagePath;
  }

  edit() {
    this.canEdit = true;
  }

  cancelEdit() {
    this.canEdit = false;
  }

  saveEdit() {
    this.waiting = true;
    this.contractService.setDefenseUnitIdArray(this.profile.defense).then(_ => {
      this.canEdit = false;
      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      }

      this.waiting = false;
    });
  }

  addUnit(index:number) {
    this.selectedIndex = index;
    this.willShowSelection = true;
  }

  changeUnit(index:number) {
    this.selectedIndex = index;
    this.willShowSelection = true;
  }

  removeUnit(index:number) {
    this.profile.defense[index] = 0;
  }

  onSelect($event) {
    this.willShowSelection = false;

    for (let i = 0; i < this.profile.defense.length; ++i) {
      if (this.profile.defense[i] &&
          this.profile.defense[i] == $event.unitId) {
        this.profile.defense[i] = 0;
      }
    }

    this.profile.defense[this.selectedIndex] = $event.unitId;
  }

  onClose() {
    this.willShowSelection = false;
  }

  showLandLand() {
    this.willShowLandLand = true;
  }

  closeLandLand() {
    this.willShowLandLand = false;
  }

  loadTeams() {
    this.teamCount = 0;

    const myKey = 'sg-teams-' + this.contractService.getUserAddress();
    const storedTeams = localStorage.getItem(myKey);

    if (storedTeams) {
      const teamStore = JSON.parse(storedTeams);

      for (let i = 0; i < teamStore.length; ++i) {
        let hasTeam = false;

        for (let j = 0; j < teamStore[i].length; ++j) {
          if (teamStore[i] && teamStore[i][j] && teamStore[i][j]['id']) {
            hasTeam = true;
          }
        }

        if (hasTeam) {
          ++this.teamCount;
        }
      }

    }
  }

  afterSetTeams() {
    this.showTeams = false;
    this.loadTeams();
  }

  refreshEnergy(index: number, unitId: number) {
  }

  refreshEnergyAction($event) {
    this.onRefreshEnergy.emit($event)
  }

  refreshLevel(index: number, unitId: number) {
  }

  gotoUnits() {
    if (!this.profile.units || this.profile.units.length <= 0) return;

    this.showUnits = true;
  }

  gotoItems() {
    if (!this.profile.items || this.profile.items.length <= 0) return;

    this.showItems = true;
  }

  gotoTeams(tabIndex: number) {
    if (!this.profile.units || this.profile.units.length <= 0) return;

    this.showUnits = false;
    this.showItems = false;
    this.showTeams = true;
    this.showTeamsTabIndex = tabIndex;
  }

  gotoNotifications() {
    if (!this.profile.hasStarted) return;

    this.willShowNotification = true;
  }

  gotoBattleRecord() {
    if (!this.profile.hasStarted) return;

    this.willShowBattleRecord = true;
  }

  closeNotifications() {
    this.willShowNotification = false;
  }

  closeBattleRecord() {
    this.willShowBattleRecord = false;
  }

  showReferralProgram() {
    if (!this.profile.hasStarted) return;

    this.willShowReferralProgram = true;
  }

  closeReferralProgram() {
    this.willShowReferralProgram = false;
  }

  showMessage(titleCN, titleEN, urlCN, urlEN) {
    this.showMessageTitleCN = titleCN;
    this.showMessageTitleEN = titleEN;
    this.showMessageUrlCN = urlCN;
    this.showMessageUrlEN = urlEN;

    this.willShowMessage = true;
  }

  closeMessage() {
    this.willShowMessage = false;
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

  showWechatBox() {
    this.onShowWechatBox.emit();
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.playerGearSelection) {
      this.playerGearSelection.changeLanguage(language);
    }

    if (this.playerProfile) {
      this.playerProfile.changeLanguage(language);
    }

    if (this.playerGear) {
      this.playerGear.changeLanguage(language);
    }

    if (this.playerTeam) {
      this.playerTeam.changeLanguage(language);
    }

    if (this.dashboardMessage) {
      this.dashboardMessage.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }

    if (this.notification) {
      this.notification.changeLanguage(language);
    }

    if (this.battleRecord) {
      this.battleRecord.changeLanguage(language);
    }

    if (this.referralProgram) {
      this.referralProgram.changeLanguage(language);
    }

    if (this.landLand) {
      this.landLand.changeLanguage(language);
    }
  }
}
