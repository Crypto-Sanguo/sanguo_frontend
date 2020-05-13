import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-player-team',
  templateUrl: './player-team.component.html',
  styleUrls: ['./player-team.component.css']
})
export class PlayerTeamComponent implements OnInit {

  @ViewChild('playerGearSelection') playerGearSelection;
  @Input() profile: any;
  @Input() initialTabIndex: number;
  @Output() onGoBack: EventEmitter<any> = new EventEmitter();

  myKey = 'sg-teams'

  language: number = 0;

  tabIndex: number = 0;

  teamArray = [];
  teamStore = [];

  willShowSelection = false;
  teamI: number = 0;
  teamJ: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.showTab(this.initialTabIndex);
  }

  loadTeam(size: number) {
    if (size == 3) {
      this.myKey = 'sg-teams-' + this.contractService.getUserAddress();
    } else {
      this.myKey = 'sg-teams-6-' + this.contractService.getUserAddress();
    }

    let storedTeams = localStorage.getItem(this.myKey);

    if (storedTeams) {
      this.teamArray = JSON.parse(storedTeams);
      this.teamStore = JSON.parse(storedTeams);

      for (let i = 0; i < this.teamArray.length; ++i) {
        for (let j = 0; j < this.teamArray[i].length; ++j) {
          if (this.teamArray[i] && this.teamArray[i][j] && this.teamArray[i][j]['id']) {
            if (!this._hasUnitId(parseInt(this.teamArray[i][j]['id']))) {
              // Remove non-existing units.
              this.teamArray[i][j] = null;
              this.teamStore[i][j] = null;
            } else {
              this.teamArray[i][j]['src'] = environment.unitData[this.teamArray[i][j]['id']].imagePath;
            }
          }
        }
      }
        
      // Save after removing non-existing units.
      localStorage.setItem(this.myKey, JSON.stringify(this.teamStore));
    } else {
      this.teamArray = [];
      this.teamStore = [];
      for (let i = 0; i < 9; ++i) {
        const entry0 = [];
        const entry1 = [];
        for (let j = 0; j < size; ++j) {
          entry0.push(null);
          entry1.push(null);
        }
        this.teamArray.push(entry0);
        this.teamStore.push(entry1);
      }
    }
  }

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    this.loadTeam(tabIndex == 0 ? 3 : 6);
  }

  _hasUnitId(unitId) {
    var has = false;
    this.profile.units.map(unit => {
      if (unit.unitId == unitId) {
        has = true;
      }
    });

    return has;
  }

  goBack() {
    this.onGoBack.emit();
  }

  addUnit(teamI: number, teamJ: number) {
    this.teamI = teamI;
    this.teamJ = teamJ;
    this.willShowSelection = true;
  }

  removeUnit(teamI: number, teamJ: number) {
    this.teamArray[teamI][teamJ] = null;
    this.teamStore[teamI][teamJ] = null;
    localStorage.setItem(this.myKey, JSON.stringify(this.teamStore));
  }

  changeUnit(teamI: number, teamJ: number) {
    this.teamI = teamI;
    this.teamJ = teamJ;
    this.willShowSelection = true;
  }

  changeLanguage(language: number) {
    this.language = language;
    
    if (this.playerGearSelection) {
      this.playerGearSelection.changeLanguage(language);
    }
  }

  onSelect($event) {
    for (let j = 0; j < 9; ++j) {
      if (this.teamArray[this.teamI][j] && this.teamArray[this.teamI][j]['id'] == $event.unitId) {
        this.teamArray[this.teamI][j] = null;
        this.teamStore[this.teamI][j] = null;
      }
    }

    this.teamArray[this.teamI][this.teamJ] = {
      id: $event.unitId,
      src: environment.unitData[$event.unitId].imagePath
    };

    this.teamStore[this.teamI][this.teamJ] = {
      id: $event.unitId
    };

    localStorage.setItem(this.myKey, JSON.stringify(this.teamStore));

    this.willShowSelection = false;
  }

  onClose() {
    this.willShowSelection = false;
  }
}
