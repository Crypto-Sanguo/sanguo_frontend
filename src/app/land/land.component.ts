import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';
import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

import { BattleManager } from '../battle-manager';
import { LandManager } from '../land-manager';
import { ItemManager } from '../item-manager';
import { UnitManager } from '../unit-manager';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css']
})
export class LandComponent implements OnInit {

  @Input() profile: any;
  @Output() onSetTeams: EventEmitter<any> = new EventEmitter();
  @ViewChild('battle') battle;
  @ViewChild('landLand') landLand;
  @ViewChild('createCity') createCity;
  @ViewChild('teamSelection') teamSelection;

  @ViewChild('alertMessage') alertMessage;

  waiting: boolean = false;

  battleManager: any = null;
  landManager: any = null;
  itemManager: any = null;
  unitManager: any = null;

  allPeers: Array<any> = [];
  allCities: Array<any> = [];

  inCity: boolean = false;
  selectedCityId: number = 0;
  selectedCityOwner: string = '';

  currentPage: number = 1;
  hasMore: boolean = false;
  allOffers: Array<any> = [];

  willShowCreateCity: boolean = false;

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  battlePeer: string = '';
  battleField: any = null;
  battleRecord: any = null;
  waitingForBattle: boolean = false;
  inBattle: boolean = false;
  showTeamSelection = false;
  cityIdToAttack: number = 0;
  peerToAttack: string = '';
  peerToAttackPaid: boolean = false;

  tabIndex: number = 0;

  language: number = 0;

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.battleManager = new BattleManager(this.contractService.myIOST);
    this.landManager = new LandManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.showTab(0);
  }

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;

    if (tabIndex == 0) {
      this.reloadCities();
    } else {
      this.gotoPage(1);
    }
  }

  reloadCities() {
    this.waiting = true;
    this.landManager.getAllCities().then(cities => {
      this.allCities = cities;
      this.waiting = false;
      cities.forEach(async c => {
        const pool = await this.landManager.getPool(c.cityId);
        c.accumulated = pool.accumulated || 0;
      });
    });
  }

  refresh() {
    if (this.tabIndex == 0) {
      this.reloadCities();
    } else {
      this.gotoPage(this.currentPage);
    }
  }

  _fillCityId(offers: Array<any>) {
    offers.forEach(offer => {
      this.landManager.getLand(offer.landId).then(land => {
        offer.cityId = land.cityId;
      });
    });
  }

  async gotoPage(page: number) {
    if (page < 1) return;

    this.currentPage = page;

    const limit = 21;
    const offset = (page - 1) * 20;
    this.waiting = true;

    if (this.tabIndex == 1) {
      this.allPeers = await this.unitManager.getUsersWithNoFarms(this.gateService, limit, offset);
    } else if (this.tabIndex == 2) {
      this.allOffers = await this.gateService.getLandRents(-1, limit, offset);
    } else if (this.tabIndex == 3) {
      this.allOffers = await this.gateService.getLandSells(-1, limit, offset);
    }

    if (this.tabIndex == 1) {
      const now = Math.floor((new Date()).getTime() / 1000);

      this.allPeers.forEach(peer => {
        this.battleManager.canDefenseObj(peer.name).then(obj => {
          peer.isSafe = this._ceilDate(now - this.profile.timeD) == this._ceilDate(obj.defense < 1577682626 ? obj.defense + 46800 : obj.defense);
          peer.isVerySafe = peer.isSafe && obj.defenseCount >= 1;
        });
      });

      this.hasMore = this.allPeers.length > 20;
      this.allPeers = this.allPeers.slice(0, 20);
    } else {
      this.hasMore = this.allOffers.length > 20;
      this.allOffers = this.allOffers.slice(0, 20);
      this._fillCityId(this.allOffers);
    }

    this.waiting = false;
  }

  getUnitName(unitId: number) {
    return [environment.unitData[unitId].nameCN, environment.unitData[unitId].nameEN];
  }

  getUnitImagePath(unitId: number) {
    return environment.unitData[unitId].imagePath || '/assets/images/bg.png';
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

  enterCity(cityId: number, cityOwner: string) {
    this.selectedCityId = cityId;
    this.selectedCityOwner = cityOwner;
    this.inCity = true;
  }

  exitCity() {
    this.inCity = false;
  }

  async showScore(city: any) {
    city.scoreLoading = true;

    const attackPoints = await this.landManager.getAttackPoints(city.cityId);
    const defensePoints = await this.landManager.getDefensePoints(city.cityId);

    let txtCN = '进攻积分:\n\n';
    let txtEN = 'Attack Score:\n\n';

    let total = 0;
    attackPoints.forEach(entry => {
      const who = entry[0];
      if (who == "-date") return;;

      const point = entry[1];
      total += point;

      txtCN += who + ': ' + point + '\n';
      txtEN += who + ': ' + point + '\n';
    });

    txtCN += '\n总分: ' + total + '\n';
    txtEN += '\nTotal: ' + total + '\n';

    txtCN += '\n防守积分:\n\n';
    txtEN += '\nDefense Score:\n\n';

    total = 0;
    defensePoints.forEach(entry => {
      const who = entry[0];
      if (who == "-date") return;

      const point = entry[1];
      total += point;

      txtCN += who + ': ' + point + '\n';
      txtEN += who + ': ' + point + '\n';
    });

    txtCN += '\n总分: ' + total;
    txtEN += '\nTotal: ' + total;

    city.scoreLoading = false;

    this.showAlert('积分', 'Score', txtCN, txtEN);
  }

  create() {
    this.willShowCreateCity = true;
  }

  onClose() {
    this.willShowCreateCity = false;
  }

  onCloseAndRefresh() {
    this.willShowCreateCity = false;
    this.showAlert('创建成功', 'Successfully created', '', '');
    this.reloadCities();
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

  rentLand(landId: number, price: number) {
    this.waiting = true;

    this.contractService.rentFrom(landId, price).then(res => {
      this.waiting = false;

      if (res * 1) {
        this.showAlert('租用成功', 'Rented successfully', '', '');
      } else {
        this.showAlert('租用失败', 'Rental failed', '可能被别人抢走了', 'Someone got it before you');
      }

      this.refresh();
    }, err => {
      if (err.indexOf('balance not enough') >= 0) {
        this.showAlert('余额不足', 'Balance not enough',
            '您钱包中的IOST余额不足', 'You don\'t have enough IOST');
      } else if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      }

      this.waiting = false;
    });
  }

  buyLand(landId: number, price: number) {
    this.waiting = true;

    this.contractService.buyLand(landId, price).then(res => {
      this.waiting = false;
      
      if (res * 1) {
        this.showAlert('购买成功', 'Purchased successfully', '', '');
      } else {
        this.showAlert('购买失败', 'Purchase failed', '可能被别人抢走了', 'Someone bought it before you');
      }
      
      this.refresh();
    }, err => {
      if (err.indexOf('balance not enough') >= 0) {
        this.showAlert('余额不足', 'Balance not enough',
            '您钱包中的IOST余额不足', 'You don\'t have enough IOST');
      } else if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      }
      
      this.waiting = false;
    });
  }

  isMe(who: string) {
    return this.contractService.isMe(who);
  }

  _ceilDate(time: number): number {
    if (time < 46800) return 0;
    return Math.ceil((time - 46800) / 86400);
  }

  isDefeated(time: number) {
    const now = Math.floor((new Date()).getTime() / 1000);
    return this._ceilDate(now - this.profile.timeD) == this._ceilDate(time < 1577682626 ? time + 46800 : time);
  }

  finishBattle($event) {
    this.inBattle = false;
    if ($event.didWin) {
      this.showAlert('击败了' + this.battlePeer, 'Defeated ' + this.battlePeer, '', '');
    } else {
      this.showAlert('败给了' + this.battlePeer, 'Defeated by ' + this.battlePeer, '', '');
    }
  }

  async _processBattleField(unitIdArray, peerUnitIdArray, who) {
    this.battleField = [];

    const peerUnits = await this.unitManager.getPeerStatusPro(this.itemManager, who, peerUnitIdArray);

    peerUnitIdArray.map(unitId => {
      if (!unitId) {
        this.battleField.push({
          unitId: 0,
          level: 0,
          hp: 0
        });
        return;
      }

      const results = peerUnits.filter(unit => {
        return unit.unitId == unitId;
      });

      this.battleField.push({
        unitId: results[0].unitId,
        level: results[0].level,
        hp: results[0].hp
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

  attackCity(cityId: number) {
    if (this.profile.unitsLoading) {
      this.showAlert("请等待英雄读取", "Please wait for loading heroes",
                     "晚几秒再开战", "Come back in a few seconds");
      return;
    }

    this.cityIdToAttack = cityId;
    this.peerToAttack = '';

    this.showTeamSelection = true;
  }

  attackPeer(who: string, paid: boolean) {
    if (this.profile.unitsLoading) {
      this.showAlert("请等待英雄读取", "Please wait for loading heroes",
                     "晚几秒再开战", "Come back in a few seconds");
      return;
    }

    this.cityIdToAttack = 0;
    this.peerToAttack = who;
    this.peerToAttackPaid = paid;

    this.showTeamSelection = true;
  }

  async onSelectTeam($event) {
    this.showTeamSelection = false;
    this.waitingForBattle = true;

    var p;
    if (this.cityIdToAttack && !this.peerToAttack) {
      p = this.contractService.attackCity($event.unitIdArray, this.cityIdToAttack);
    } else {
      p = this.contractService.battleWithPeer($event.unitIdArray, this.peerToAttack, this.peerToAttackPaid);
    }

    p.then(async battleRecord => {
      console.log(battleRecord);
      this.battleRecord = battleRecord;
      this.battlePeer = battleRecord.peer;
      await this._processBattleField($event.unitIdArray, battleRecord.peerUnitIdArray, battleRecord.peer);

      this.waitingForBattle = false;
      this.inBattle = true;

      // Maybe refresh here.
      if (battleRecord.didIWin) {
        if (this.cityIdToAttack && !this.peerToAttack) {
          // Just refresh one city.
          this.landManager.getOneCity(this.cityIdToAttack).then(city => {
            for (let i = 0; i < this.allCities.length; ++i) {
              if (this.allCities[i].cityId == city.cityId) {
                this.allCities[i] = city;
                break;
              }
            }
          });
        } else {
          this.refresh();
        }
      }
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('destroy more than balance') >= 0) {
        this.showAlert('三国币数量不足', 'Your don\'t have enough SGT', '', '');
      } else if (err.indexOf('already broken') >= 0) {
        this.showAlert('已经被他人破城', 'Already defeated by others',
            '请进城直接掠夺', 'Please enter to launch more attacks');
      } else if (err.indexOf('can not attack') >= 0) {
        this.showAlert('此用户在安全状态', 'This player is in safe mode',
            '似乎已被他人攻击，请刷新后再试', 'Seams someone attacked him before you; please refresh and retry');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      }

      this.waitingForBattle = false;
    });
  }

  onFinishTeam() {
    this.showTeamSelection = false;
  }

  setTeams($event) {
    this.onSetTeams.emit($event);
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.landLand) {
      this.landLand.changeLanguage(language);
    }

    if (this.createCity) {
      this.createCity.changeLanguage(language);
    }

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
}
