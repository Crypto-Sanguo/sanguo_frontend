import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { StageManager } from '../stage-manager';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  @ViewChild('battle') battle;
  @ViewChild('teamSelection') teamSelection;
  @ViewChild('alertMessage') alertMessage;

  @Input() stageIndex: number;
  @Input() placeIndex: number;
  @Input() battleIndex: number;
  @Input() profile: any;

  @Output() onFinish: EventEmitter<any> = new EventEmitter();
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  npcNameCN: string = '';
  npcNameEN: string = '';
  npcImagePath: string = '';
  npcTextCN: string = '';
  npcTextEN: string = '';

  stageManager: any = null;

  talkIndex: number = 0;

  talkStatus: number = 0;

  waiting: boolean = false;
  inBattle: boolean = false;

  battleField: any = null;
  battleRecord: any = null;
  battleUnitLimit: number = 3;

  showTeamSelection = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.stageManager = new StageManager(this.contractService.myIOST);

    this.talk(false);
  }

  talk(didWin: boolean) {
    const battle = environment.stageData[this.stageIndex].places[this.placeIndex].battles[this.battleIndex];

    if (this.talkStatus == 0 && this.talkIndex >= battle.preWords.length) {
      this.talkStatus = 1;
      this.talkIndex = 0;
      return;
    } else if (this.talkStatus == 1) {
      return;
    } else if (this.talkStatus == 2 && this.talkIndex >= battle.afterWords.length) {
      this.onFinish.emit();
      return;
    }

    if (this.talkStatus == 0) {
      this.npcNameCN = battle.preWords[this.talkIndex].npcNameCN;
      this.npcNameEN = battle.preWords[this.talkIndex].npcNameEN;
      this.npcImagePath = battle.preWords[this.talkIndex].npcImagePath;
      this.npcTextCN = battle.preWords[this.talkIndex].npcTextCN;
      this.npcTextEN = battle.preWords[this.talkIndex].npcTextEN;
    } else {
      this.npcNameCN = battle.afterWords[this.talkIndex].npcNameCN;
      this.npcNameEN = battle.afterWords[this.talkIndex].npcNameEN;
      this.npcImagePath = battle.afterWords[this.talkIndex].npcImagePath;

      if (didWin) {
        this.npcTextCN = battle.afterWords[this.talkIndex].npcTextCN;
        this.npcTextEN = battle.afterWords[this.talkIndex].npcTextEN;
      } else {
        this.npcTextCN = battle.afterWords[this.talkIndex].npcTextCN2;
        this.npcTextEN = battle.afterWords[this.talkIndex].npcTextEN2;
      }
    }

    ++this.talkIndex;
  }

  startBattle() {
    if (this.profile.unitsLoading) {
      this.showAlert("请等待英雄读取", "Please wait for loading heroes",
                     "晚几秒再开战", "Come back in a few seconds");
      return;
    }

    this.showTeamSelection = true;
  }

  quitBattle() {
    this.onFinish.emit();
  }

  finishBattle($event) {

    if ($event.didWin) {
      // Maybe unlock new stages.
      environment.stageIdArray.forEach((stageId, i) => {
        // asyncly loads progress.
        this.stageManager.refreshStageByProgress(stageId, this.profile.stages[i]);
      });
    }

    this.inBattle = false;
    this.talkStatus = 2;

    this.talk($event.didWin);
  }

  _processBattleField(unitIdArray, stageIndex, placeIndex, battleIndex) {
    this.battleField = [];

    this.profile.stages[stageIndex][placeIndex][battleIndex].units.map(unit => {
      this.battleField.push({
        unitId: unit.unitId,
        level: unit.level,
        hp: unit.hp
      });
    });

    unitIdArray.map(unitId => {
      if (!unitId) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
        return;
      }

      const results = this.profile.units.filter(unit => {
        return unit.unitId == unitId;
      });

      this.battleField.push({
        unitId: results[0].unitId,
        level: results[0].level,
        hp: results[0].hp + results[0].hpP
      });
    });
  }

  onSelectTeam($event) {
    this.showTeamSelection = false;
    this.waiting = true;

    const stageId = this.stageIndex + 1;  // TODO: get stageId from data.

    this._processBattleField($event.unitIdArray, this.stageIndex, this.placeIndex, this.battleIndex);

    var func;

    if ($event.batch) {
      func = (unitIdArray, stageId, placeIndex, battleIndex) =>
          this.contractService.battleWithStageBatch(unitIdArray, stageId, placeIndex, battleIndex);
    } else {
      func = (unitIdArray, stageId, placeIndex, battleIndex) =>
          this.contractService.battleWithStage(unitIdArray, stageId, placeIndex, battleIndex);
    }

    func(
        $event.unitIdArray, stageId, this.placeIndex, this.battleIndex).then(battleRecord => {
      console.log(battleRecord);
      this.battleRecord = battleRecord;

      this.waiting = false;
      this.battleUnitLimit = $event.unitIdArray.length;
      this.inBattle = true;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('balance not enough') >= 0) {
        this.showAlert('您钱包中的IOST余额不足', 'You don\'t have enough IOST', '','');
      } else {
        this.showAlert('未知错误，请截屏给管理员','System errror', err, err);
      }

      this.waiting = false;
    });
  }

  onFinishTeam() {
    this.showTeamSelection = false;
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.battle) {
      this.battle.changeLanguage(language);
    }

    if (this.teamSelection) {
      this.teamSelection.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
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
