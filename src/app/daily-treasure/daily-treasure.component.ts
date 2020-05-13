import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import {TreasureManager} from '../treasure-manager';
import {LotteryManager} from '../lottery-manager';
import {UnitManager} from '../unit-manager';
import {ItemManager} from '../item-manager';
import {LandManager} from '../land-manager';


@Component({
  selector: 'app-daily-treasure',
  templateUrl: './daily-treasure.component.html',
  styleUrls: ['./daily-treasure.component.css']
})
export class DailyTreasureComponent implements OnInit {
  
  @ViewChild('treasureRules') treasureRules;
  @ViewChild('treasureDividendOne') treasureDividendOne;
  @ViewChild('treasureDividendTwo') treasureDividendTwo;
  @ViewChild('treasureDividendThree') treasureDividendThree;
  @ViewChild('treasureDividendFour') treasureDividendFour;
  @ViewChild('alertMessage') alertMessage;
  @ViewChild('xmasLottery') xmasLottery;
  @ViewChild('marketInfo') marketInfo;
  @ViewChild('loginBox') loginBox;
  @Input() profile: any;

  tabIndex = 0;

  willShowRules:boolean = false;
  willShowDividendOne:boolean = false;

  canShowDividendTwo:boolean = false;
  willShowDividendTwo:boolean = false;

  willShowDividendThree:boolean = false;
  willShowDividendFour:boolean = false;

  @Output() onClose: EventEmitter<any> = new EventEmitter();

  treasureManager: any = null;
  lotteryManager: any = null;
  unitManager: any = null;
  itemManager: any = null;
  landManager: any = null;

  rHours: number = 0;
  rMinutes: number = 0;
  rSeconds: number = 0;
  rTime: number = 0;
  wHours: number = 0;
  wMinutes: number = 0;
  wSeconds: number = 0;
  wTime: number = 0;

  p1: number = 0;
  p2: number = 0;
  p3: number = 0;
  p4: number = 0;
  n1: number = 0;
  n2: number = 0;
  n3: number = 0;
  n4: number = 0;
  d1: number = 0;
  d2: number = 0;
  d3: number = 0;
  d4: number = 0;

  cDividendEst: number = 0;
  bDividendEst: number = 0;
  burnAmount: string = "0";

  willShowMarketInfo = false;
  unitInfoId: number = 0;

  ticketAmountMax: number = 0;
  ticketAmount0: string = "0";
  ticketAmount1: string = "0";
  ticketAmount2: string = "0";
  ticketAmount3: string = "0";
  ticketAmount4: string = "0";
  hasLiuBei: boolean = false;
  hasCaoCao: boolean = false;
  hasLvBu: boolean = false;
  hasXiaoQiao: boolean = false;
  hasYuanShao: boolean = false;

  unitsFromChannel: Array<any> = [];

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  willShowXmasLottery: boolean = false;

  willShowLoginBox: boolean = false;

  itemsFromBadLuck: Array<any> = [];
  unitsFromBadLuck: Array<any> = [];

  badLuck: number = 0;

  waiting: boolean = false;
  waitingData: boolean = false;

  language: number = 0;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.treasureManager = new TreasureManager(this.contractService.myIOST);
    this.lotteryManager = new LotteryManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);
    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.landManager = new LandManager(this.contractService.myIOST);

    this.loadAll();

    this.treasureManager.getRemainingTime().then(res => {
      this.rTime = res[0];
      this.wTime = res[1];

      this._showTime();
    });

    this.treasureManager.canShowBurningDividends().then(res => {
      this.canShowDividendTwo = res;
    });

    this.lotteryManager.getLotteryTicketAmount().then(amount => {
      this.ticketAmountMax = amount;
    });

    setInterval(() => this._tickTime(), 1000);

    if (!this.profile.walletReady || !this.profile.hasStarted) {
      this.showLoginBox();
    }

    this.landManager.getMyAttackPoint().then(value => {
      this.n3 = value;
    });
    this.landManager.getSumOfAttackPoint().then(sum => {
      this.d3 = sum;
    });
  }

  hasUnit(unitIdArray: Array<number>, unitId: number) {
    for (let i = 0; i < unitIdArray.length; ++i) {
      if (unitIdArray[i] * 1 == unitId) {
        return true;
      }
    }
    return false;
  }

  async showTab(tabIndex: number) {
    this.tabIndex = tabIndex;


    this.waitingData = true;

    var unitIdArray;
    if (this.profile.unitsLoading) {
      unitIdArray = await this.unitManager.getMyUnitIdArray();
    } else {
      unitIdArray = this.profile.units.map(unit => unit.unitId);
    }

    if (tabIndex == 1) {
      this.waitingData = false;
      this.hasLiuBei = this.hasUnit(unitIdArray, 19);
      this.hasCaoCao = this.hasUnit(unitIdArray, 20);
      this.hasLvBu = this.hasUnit(unitIdArray, 21);
      this.hasXiaoQiao = this.hasUnit(unitIdArray, 40);
      this.hasYuanShao = this.hasUnit(unitIdArray, 39);
    } else if (tabIndex == 2) {
      const store = await this.lotteryManager.getBadLuckStore();
      this.waitingData = false;

      this.unitsFromBadLuck = store.units.map(unit => {
        return {
          unitId: unit.unitId,
          count: unit.count,
          imagePath: environment.unitData[unit.unitId].imagePath,
          nameCN: environment.unitData[unit.unitId].nameCN,
          nameEN: environment.unitData[unit.unitId].nameEN,
          owned: this.hasUnit(unitIdArray, unit.unitId)
        };
      });
/*
      this.itemsFromBadLuck = store.items.map(item => {
        return {
          itemId: item.itemId,
          count: item.count,
          imagePath: environment.itemData[item.itemId].imagePath,
          nameCN: environment.itemData[item.itemId].nameCN,
          nameEN: environment.itemData[item.itemId].nameEN
        };
      });
*/

      this.badLuck = await this.lotteryManager.getBadLuck();
    } else {
      this.waitingData = false;

      this.unitsFromChannel = [{
        unitId: 30,
        nameCN: '孙尚香',
        nameEN: 'Sun Shang Xiang',
        imagePath: '/assets/images/heroes/sunshangxiang.jpg',
        owned: this.hasUnit(unitIdArray, 30)
      }, {
        unitId: 32,
        nameCN: '徐晃',
        nameEN: 'Xu Huang',
        imagePath: '/assets/images/heroes/xuhuang.jpg',
        owned: this.hasUnit(unitIdArray, 32)
      }];
    }
  }

  async loadAll() {
    const today = await this.treasureManager.getToday();
    const thisWeek = await this.treasureManager.getThisWeek();

    const one = [
      (async () => {
        this.p1 = await this.treasureManager.getPool1(today);
      }) (),
      (async () => {
        this.n1 = await this.treasureManager.getHolding(today);
      }) (),
      (async () => {
        this.d1 = await this.treasureManager.getHoldingAll(today);
      }) (),
      (async () => {
        this.p3 = await this.treasureManager.getPool3(today);
      }) ()
    ];

    const two = [
      (async () => {
        this.p2 = await this.treasureManager.getPool2(today);
      }) (),
      (async () => {
        this.n2 = await this.treasureManager.getBurning(today);
      }) (),
      (async () => {
        this.d2 = await this.treasureManager.getBurningAll(today);
      }) ()
    ];

    const four = [
      (async () => {
        this.p4 = await this.treasureManager.getPool4(thisWeek);
      }) (),
      (async () => {
        this.n4 = await this.treasureManager.getLand(thisWeek);
      }) (),
      (async () => {
        this.d4 = await this.treasureManager.getLandAll(thisWeek);
      }) ()
    ];

    Promise.all(one).then(_ => {
      this.cDividendEst = this.d1 ? this.p1 * this.n1 / this.d1 : 0;
    });
    Promise.all(two).then(_ => {
      this.burnAmountValueChange();
    });
    Promise.all(four);
  }

  formatNumber(x: number) {
    if (x >= 10000000000) {
      return (x / 1000000000).toFixed(0) + ' B';
    } else if (x >= 1000000000) {
      return +(x / 1000000000).toFixed(1) + ' B';
    } else if (x >= 10000000) {
      return (x / 1000000).toFixed(0) + ' M';
    } else if (x >= 1000000) {
      return +(x / 1000000).toFixed(1) + ' M';
    } else if (x >= 10000) {
      return (x / 1000).toFixed(0) + ' K';
    } else if (x >= 1000) {
      return +(x / 1000).toFixed(1) + ' K';
    } else if (x > 10) {
      return +(x * 1).toFixed(1);
    } else if (x > 1) {
      return +(x * 1).toFixed(2);
    } else if (x > 0) {
      return +(x * 1).toFixed(2);
    } else {
      return '0';
    }
  }

  burnAmountValueChange() {
    setTimeout(() => {
      let burnAmountAsNumber = parseInt(this.burnAmount);
      if (isNaN(burnAmountAsNumber)) {
        burnAmountAsNumber = 0;
      }

      this.bDividendEst = (burnAmountAsNumber + this.n2 * 1) / (burnAmountAsNumber + this.d2 * 1) * this.p2;
    }, 100);
  }

  burnAmountToZero() {
    this.burnAmount = '';
    this.burnAmountValueChange();
  }

  burnAmountToMax() {
    this.burnAmount = this.n1.toString();
    this.burnAmountValueChange();
  }

  burn() {
    if (!this.burnAmount) return;
    const burnAmountAsNumber = parseInt(this.burnAmount);
    if (isNaN(burnAmountAsNumber) || burnAmountAsNumber == 0) return;

    this.waiting = true;

    this.contractService.burnForDividend(burnAmountAsNumber).then(async _ => {
      this.n2 += burnAmountAsNumber;
      this.d2 += burnAmountAsNumber;
      this.burnAmount = '';

      this.showAlert('销毁成功', 'Succeeded',
          '明天即可收到分红', 'You will receive dividend tomorrow');

      this.waiting = false;
      this.profile.balance = await this.treasureManager.getMyBalance();
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  _tickTime() {
    if (this.rTime > 0) {
      --this.rTime;
    }

    if (this.wTime) {
      --this.wTime;
    }

    this._showTime();
  }

  _showTime() {
    this.rSeconds = this.rTime % 60;
    this.rMinutes = Math.floor(this.rTime / 60) % 60;
    this.rHours = Math.floor(this.rTime / 3600);
    this.wSeconds = this.wTime % 60;
    this.wMinutes = Math.floor(this.wTime / 60) % 60;
    this.wHours = Math.floor(this.wTime / 3600);
  }

  ticketAmountValueChange(index) {
    setTimeout(() => {
      let ticketAmountAsNumber = parseInt([this.ticketAmount0, this.ticketAmount1, this.ticketAmount2, this.ticketAmount3, this.ticketAmount4][index]);
      if (isNaN(ticketAmountAsNumber)) {
        ticketAmountAsNumber = 0;
      }
    }, 100);
  }

  ticketAmountToZero(index) {
    if (index == 0) {
      this.ticketAmount0 = '';
    } else if (index == 1) {
      this.ticketAmount1 = '';
    } else if (index == 2) {
      this.ticketAmount2 = '';
    } else if (index == 3) {
      this.ticketAmount3 = '';
    } else {
      this.ticketAmount4 = '';
    }
    this.ticketAmountValueChange(index);
  }

  ticketAmountToMax(index) {
    if (index == 0) {
      this.ticketAmount0 = this.ticketAmountMax.toString();
    } else if (index == 1) {
      this.ticketAmount1 = this.ticketAmountMax.toString();
    } else if (index == 2) {
      this.ticketAmount2 = this.ticketAmountMax.toString();
    } else if (index == 3) {
      this.ticketAmount3 = this.ticketAmountMax.toString();
    } else {
      this.ticketAmount4 = this.ticketAmountMax.toString();
    }

    this.ticketAmountValueChange(index);
  }

  drawUnit(unitId: number) {
    var ticketAmount;

    if (unitId == 19) {
      ticketAmount = this.ticketAmount0;
    } else if (unitId == 20) {
      ticketAmount = this.ticketAmount1;
    } else if (unitId == 21) {
      ticketAmount = this.ticketAmount2;
    } else if (unitId == 40) {
      ticketAmount = this.ticketAmount3;
    } else if (unitId == 39) {
      ticketAmount = this.ticketAmount4;
    } else {
      return;
    }

    if (!ticketAmount) return;
    const ticketAmountAsNumber = parseInt(ticketAmount);
    if (isNaN(ticketAmountAsNumber) || ticketAmountAsNumber == 0) return;

    this.waiting = true;

    this.contractService.drawUnit(unitId, ticketAmountAsNumber).then(async result => {
      this.ticketAmountMax -= ticketAmountAsNumber;
      this.ticketAmount0 = '0';
      this.ticketAmount1 = '0';
      this.ticketAmount2 = '0';
      this.ticketAmount3 = '0';
      this.ticketAmount4 = '0';

      if (result) {
        this.showAlert('恭喜您', 'Congratulations',
            '抽到新英雄', 'You got a new hero');

        // Refresh my heroes and defense.
        this.unitManager.getMyOneUnit(this.itemManager, unitId).then(unit => {
          this.profile.units.push(unit);
        });

        if (unitId == 19) {
          this.hasLiuBei = true;
        } else if (unitId == 20) {
          this.hasCaoCao = true;
        } else if (unitId == 21) {
          this.hasLvBu = true;
        } else if (unitId == 40) {
          this.hasXiaoQiao = true;
        } else if (unitId == 39) {
          this.hasYuanShao = true;
        }

        this.unitManager.getDefenseUnitIdArray().then(unitIdArray => {
          this.profile['defense'] = unitIdArray;
        });
      } else {
        this.showAlert('稍有些遗憾', 'Not lucky enough',
            '没有抽到新英雄', 'You didn\'t win anything');
      }

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  buyUnitWithBadLuck(unitId: number) {
    this.waiting = true;

    this.contractService.buyUnitWithBadLuck(unitId).then(async _ => {
      this.showAlert('恭喜您', 'Congratulations',
          '获得新英雄', 'You got a new hero');

      // Refresh my heroes and defense.
      this.unitManager.getMyOneUnit(this.itemManager, unitId).then(unit => {
        this.profile.units.push(unit);
      });

      if (unitId == 19) {
        this.hasLiuBei = true;
      } else if (unitId == 20) {
        this.hasCaoCao = true;
      } else if (unitId == 21) {
        this.hasLvBu = true;
      } else if (unitId == 40) {
        this.hasXiaoQiao = true;
      } else if (unitId == 39) {
        this.hasYuanShao = true;
      }

      this.unitManager.getDefenseUnitIdArray().then(unitIdArray => {
        this.profile['defense'] = unitIdArray;
      });

      this.badLuck = await this.lotteryManager.getBadLuck();

      this.waiting = false;
    }, err => {
      if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
            err, err);
      }

      this.waiting = false;
    });
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.treasureRules) {
      this.treasureRules.changeLanguage(language);
    }

    if (this.treasureDividendOne) {
      this.treasureDividendOne.changeLanguage(language);
    }

    if (this.treasureDividendTwo) {
      this.treasureDividendTwo.changeLanguage(language);
    }

    if (this.treasureDividendThree) {
      this.treasureDividendThree.changeLanguage(language);
    }

    if (this.treasureDividendFour) {
      this.treasureDividendFour.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }

    if (this.xmasLottery) {
      this.xmasLottery.changeLanguage(language);
    }

    if (this.loginBox) {
      this.loginBox.changeLanguage(language);
    }
  }

  showRule() {
    this.willShowRules = true;
  }

  closeRule() {
    this.willShowRules = false;
  }

  showDividendOne() {
    this.willShowDividendOne = true;
  }

  closeDividendOne() {
    this.willShowDividendOne = false;
  }

  showDividendTwo() {
    this.willShowDividendTwo = true;
    this.canShowDividendTwo = false;
  }

  closeDividendTwo() {
    this.willShowDividendTwo = false;
  }

  showDividendThree() {
    this.willShowDividendThree = true;
  }

  closeDividendThree() {
    this.willShowDividendThree = false;
  }

  showDividendFour() {
    this.willShowDividendFour = true;
  }

  closeDividendFour() {
    this.willShowDividendFour = false;
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

  closeXmasLottery() {
    this.willShowXmasLottery = false;
  }

  showLoginBox() {
    this.willShowLoginBox = true;
  }

  closeLoginBox() {
    this.willShowLoginBox = false;
  }

  showMarketInfo(unitId: number) {
    this.willShowMarketInfo = true;
    this.unitInfoId = unitId;
  }

  closeMarketInfo() {
    this.willShowMarketInfo = false;
  }
}
