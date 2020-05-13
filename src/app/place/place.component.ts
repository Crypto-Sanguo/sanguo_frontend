import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment'


@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {

  @Input() profile: any;

  @ViewChild('conversation') conversation;
  @ViewChild('tournament') tournament;

  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  tabIndex: number = 0;

  data: any = {};

  stageIndex: number = 0;
  placeIndex: number = 0;
  battleIndex: number = 0;

  language: number = 0;

  showGoBack: boolean = false;
  showStages: boolean = true;
  showPlaces: boolean = false;
  showBattles: boolean = false;

  inConversation: boolean = false;

  constructor(private contractService: ContractService) {
  }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    this.showTab(0);
    this.selectInit();
  }

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    this.data = tabIndex == 0 ? environment.stageData : environment.branchData;
  }

  selectInit() {
    this.showStages = true;
    this.showPlaces = false;
    this.showBattles = false;
    this.showGoBack = false;
  }

  selectStage(index) {
    if (!this.profile.stages[index] ||
        !this.profile.stages[index][0][0].available) {
      return;
    }

    this.showStages = false;
    this.showBattles = false;

    this.stageIndex = index;

    this.showGoBack = true;
    this.showPlaces = true;
  }

  selectPlace(index) {
    if (!this.profile.stages[this.stageIndex][index][0].available) {
      return;
    }

    this.showStages = false;
    this.showPlaces = false;

    this.placeIndex = index;
    this.showGoBack = true;
    this.showBattles = true;
  }

  goBack() {
    if (this.showPlaces) {
      this.selectInit();
    } else if (this.showBattles) {
      this.selectStage(this.stageIndex);
    }
  }

  checkBattle(index) {
    if (!this.profile.stages[this.stageIndex][this.placeIndex][index].available) return;

    this.battleIndex = index;
    this.inConversation = true;
  }

  finishConversation() {
    this.inConversation = false;

    this.selectPlace(this.placeIndex);  // Refresh.
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.conversation) {
      this.conversation.changeLanguage(language);
    }

    if (this.tournament) {
      this.tournament.changeLanguage(language);
    }
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
  }
}
