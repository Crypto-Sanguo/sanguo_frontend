import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-team-selection',
  templateUrl: './team-selection.component.html',
  styleUrls: ['./team-selection.component.css']
})
export class TeamSelectionComponent implements OnInit {

  @Input() stageIndex: number;
  @Input() placeIndex: number;
  @Input() battleIndex: number;
  @Input() profile: any;

  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();

  opponentArray = [];
  teamArray = [];
  hasTeam = false;
  selectedTeamIndex = 0;
  isStepOne = true;

  language: number = 0;

  dropItemImagePath0: string = "";
  dropItemImagePath1: string = "";
  dropItemChance0: number = 0;
  dropItemChance1: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));
    this.reload();
  }

  showEnergy(index: number) {
    const now = Math.floor((new Date()).getTime() / 1000);
    const duration = this.profile.units[index].energy.duration + (now - this.profile.units[index].energy.now - this.profile.timeD);
    const amount = this.profile.units[index].energy.amount + Math.floor(duration / 3600);
    return Math.min(10, amount);
  }

  _getUnitIdIndex(unitId) {
    var index = -1;
    for (let i = 0; i < this.profile.units.length; ++i) {
      if (this.profile.units[i].unitId == unitId) {
        index = i;
        break;;
      }
    }

    return index;
  }

  reload() {
    this.opponentArray = [];
    this.teamArray = [];
    this.hasTeam = false;
    this.selectedTeamIndex = 0;
    this.isStepOne = true;
    this.dropItemImagePath0 = "";
    this.dropItemImagePath1 = "";
    this.dropItemChance0 = 0;
    this.dropItemChance1 = 0;
    
    let myKey;
    if (this.stageIndex < 0) {
      // HACK: placeIndex == 6 if we need 6 units team.
      if (this.placeIndex == 6) {
        myKey = 'sg-teams-6-' + this.contractService.getUserAddress();
      } else {
        myKey = 'sg-teams-' + this.contractService.getUserAddress();
      }
    } else if (this.profile.stages[this.stageIndex][this.placeIndex][this.battleIndex].units.length == 3) {
      myKey = 'sg-teams-' + this.contractService.getUserAddress();
    } else {
      myKey = 'sg-teams-6-' + this.contractService.getUserAddress();
    }

    const storedTeams = localStorage.getItem(myKey);

    if (storedTeams) {
      this.teamArray = JSON.parse(storedTeams);
      const teamStore = JSON.parse(storedTeams);

      for (let i = this.teamArray.length - 1; i >= 0; --i) {
        let notEmpty = false;
        for (let j = 0; j < this.teamArray[i].length; ++j) {
          if (this.teamArray[i] && this.teamArray[i][j] && this.teamArray[i][j]['id']) {
            const index = this._getUnitIdIndex(parseInt(this.teamArray[i][j]['id']));
            if (index < 0) {
              // Remove non-existing units.
              this.teamArray[i][j] = null;
              teamStore[i][j] = null;
            } else {
              this.teamArray[i][j]['imagePath'] = environment.unitData[this.teamArray[i][j]['id']].imagePath;

              // Get unit energy.
              this.teamArray[i][j]['index'] = index;
              notEmpty = true;
            }
          }
        }

        if (!notEmpty) {
          delete this.teamArray[i];
        }

        if (notEmpty && !this.hasTeam) {
          this.hasTeam = true;
        }
      }

      // Save after removing non-existing units.
      localStorage.setItem(myKey, JSON.stringify(teamStore));
    }

    for (let i = 0; i < this.teamArray.length; ++i) {
      if (this.teamArray[i]) {
        this.selectedTeamIndex = i;
        break;
      }
    }

    if (this.stageIndex >= 0 && this.placeIndex >= 0 && this.battleIndex >= 0) {
      this.profile.stages[this.stageIndex][this.placeIndex][this.battleIndex].units.map(unit => {
        const opponentId = unit.unitId;

        if (opponentId) {
          this.opponentArray.push({
            imagePath: environment.unitData[opponentId].imagePath
          });
        } else {
          this.opponentArray.push(null);
        }
      });

      this.profile.stages[this.stageIndex][this.placeIndex][this.battleIndex].dropItems.map((item, i) => {
        if (i == 0) {
          this.dropItemImagePath0 = environment.itemData[item.itemId].imagePath;
          this.dropItemChance0 = +(item.chance * 100).toFixed(1);
        } else if (i == 1) {
          this.dropItemImagePath1 = environment.itemData[item.itemId].imagePath;
          this.dropItemChance1 = +(item.chance * 100).toFixed(1);
        }
      });
    } else {
      this.isStepOne = false;
    }
  }

  select(teamIndex: number, batch: number) {
    let noEnergy = false;

    for (let i = 0; i < this.teamArray.length; ++i) {
      if (!this.teamArray[teamIndex] || !this.teamArray[teamIndex][i]) {
        continue;
      }

      if (this.showEnergy(this.teamArray[teamIndex][i].index) <= 0) {
        this.teamArray[teamIndex][i].noEnergy = true;
        setTimeout(() => {
          this.teamArray[teamIndex][i].noEnergy = false;
        }, 150);
        // When one of the heroes has no energy.
        noEnergy = true;
      }
    }

    if (noEnergy) {
      return;
    }

    const unitIdArray = [];
    this.teamArray[teamIndex].map(unit => {
      if (unit && unit.id) {
        unitIdArray.push(unit.id);
      } else {
        unitIdArray.push(0);
      }
    });

    this.onSelect.emit({
      unitIdArray: unitIdArray,
      batch: batch
    });
  }

  changeLanguage(language: number) {
    this.language = language;
  }

  close() {
    this.onClose.emit()
  }

  setTeams() {
    const tabIndex = (this.stageIndex < 0 && this.placeIndex != 6 ||
        this.stageIndex >= 0 && this.profile.stages[this.stageIndex][this.placeIndex][this.battleIndex].units.length == 3) ? 0 : 1;
    this.onSetTeams.emit({
      tabIndex: tabIndex
    });
  }
}
