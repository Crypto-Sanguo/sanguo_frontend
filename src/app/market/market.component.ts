import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { ContractService } from '../contract.service';
import { GateService } from '../gate.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';
import { UnitManager } from '../unit-manager';


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {

  @ViewChild('marketSellUnit') marketSellUnit;
  @ViewChild('marketSellItem') marketSellItem;
  @ViewChild('marketBuyItem') marketBuyItem;
  @ViewChild('marketInfo') marketInfo;
  @ViewChild('marketItemInfo') marketItemInfo;
  @ViewChild('loginBox') loginBox;
  @ViewChild('marketFilter') marketFilter;
  @ViewChild('priceBox') priceBox;
  @ViewChild('alertMessage') alertMessage;

  @Input() profile: any;

  @Output() onRefreshLeftSide: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();

  private PAGE_LIMIT = 12;

  tabIndex = 1;

  itemManager: any = null;
  unitManager: any = null;

  unitsFromPlatform = [];
  unitOffers = [];
  itemOffers = [];

  currentPage = 1;
  hasMore = false;

  willShowLoginBox: boolean = false;

  language: number = 0;

  willShowSellUnit = false;
  willShowSellItem = false;
  willShowBuyItem = false;
  willShowMarketInfo = false;
  willShowMarketItemInfo = false;
  unitInfoId: number = 0;
  itemInfoRId: number = 0;
  itemInfoSeller: string = "";

  alertTitleCN: string = "";
  alertTitleEN: string = "";
  alertBodyCN: string = "";
  alertBodyEN: string = "";
  willShowAlertMessage: boolean = false;

  sortByPrice: number = -1;
  filterSeller: string = "";
  filterItemId: number = 0;
  filterUnitId: number = 0;
  willShowMarketFilter: boolean = false;

  starterPrice: number = 0;

  willShowPriceBox: boolean = false;
  platformUnitId: number = 0;
  platformUnitPrice: number = 0;

  waiting: boolean = false;

  constructor(private contractService: ContractService,
              private gateService: GateService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.itemManager = new ItemManager(this.contractService.myIOST);
    this.unitManager = new UnitManager(this.contractService.myIOST);

    this.showTab(1);

    if (!this.profile.walletReady || !this.profile.hasStarted) {
      this.showLoginBox();
    }

    const channel = this.getUrlParam('r', undefined) || 'sg';
    this.starterPrice = 100; //channel == "lichang" ? 0 : 100;
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

  showTab(tabIndex: number) {
    this.tabIndex = tabIndex;
    this.gotoPage(1);
  }

  gotoPage(page: number) {
    if (this.tabIndex == 0) {
      this.showUnitsFromPlatform(page);
    } else if (this.tabIndex == 1) {
      this.showUnitOffers(page);
    } else if (this.tabIndex == 2) {
      this.showItemOffers(page);
    }
  }

  refresh() {
    this.gotoPage(this.currentPage);
  }

  filter($event) {
    this.sortByPrice = $event.sortByPrice;
    this.filterSeller = $event.isOnlyMe ? this.contractService.getUserAddress() : "";
    this.filterItemId = $event.itemId;
    this.filterUnitId = $event.unitId;
    this.gotoPage(1);
    this.willShowMarketFilter = false;
  }

  showUnitsFromPlatform(page: number) {
    if (page < 1) return;

    this.currentPage = page;

    const offset = this.PAGE_LIMIT * (page - 1);
    const offsetEnd = offset + this.PAGE_LIMIT;

    // Show the "next" button if there are more.
    this.hasMore = offsetEnd < environment.unitsForSell.length;

    this.unitsFromPlatform = [];

    const unitIdArray = environment.unitsForSell.slice(offset, offsetEnd).map(unit => {
      return unit.unitId;
    });

    this.waiting = true;
    this.unitManager.getUnitArray(unitIdArray).then(units => {
      this.waiting = false;

      this.unitsFromPlatform = units.map(unit => {
        unit['nameCN'] = environment.unitData[unit.unitId].nameCN;
        unit['nameEN'] = environment.unitData[unit.unitId].nameEN;
        unit['imagePath'] = environment.unitData[unit.unitId].imagePath;
        return unit;
      });
    }, err => {
      this.waiting = false;
    });
  }

  beforeBuyUnitFromPlatform(unitId : number, unitPrice: number) {
    this.platformUnitId = unitId;
    this.platformUnitPrice = unitPrice;
    this.willShowPriceBox = true;
  }

  buyUnitFromPlatform(unitId : number, unitPrice: number) {
    this.waiting = true;
    this.contractService.buyUnitFromPlatform(unitId, unitPrice).then(value => {
      // Refresh.
      const results = this.unitsFromPlatform.filter(unit => unit.unitId == unitId);
      if (results.length > 0) {
        results[0].bought = 1;
        results[0].price = value.price;
        results[0].soldAmount = value.soldAmount;
      }

      // Refresh my heroes and defense.
      this.unitManager.getMyOneUnit(this.itemManager, unitId).then(unit => {
        this.profile.units.push(unit);
      });

      this.unitManager.getDefenseUnitIdArray().then(unitIdArray => {
        this.profile['defense'] = unitIdArray;
      });

      if (value.ticketAmount) {
        const ticketAmountStr = value.ticketAmount.toString();
        this.showAlert('恭喜您', 'Congratulations',
                       '获得' + ticketAmountStr + '次抽奖机会',
                       'You got ' + ticketAmountStr + ' tickets for lottery');
      }

      this.waiting = false;
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

  _unitIdExists(unitId: number) {
    const all = this.profile.units.filter(unit => unit.unitId == unitId);
    return all.length > 0;
  }

  _itemRIdExists(itemRId: number) {
    const all = this.profile.items.filter(item => item.rId == itemRId);
    return all.length > 0;
  }

  showUnitOffers(page: number) {
    if (page < 1) return;

    this.currentPage = page;

    const offset = this.PAGE_LIMIT * (page - 1);
    this.hasMore = false;

    this.unitOffers = [];

    this.waiting = true;
    this.unitManager.getOfferArray(
        this.gateService,
        this.sortByPrice,
        this.filterSeller,
        this.filterUnitId,
        this.PAGE_LIMIT + 1, offset).then(offers => {
      this.waiting = false;
      offers.map((offer, i) => {
        if (i >= this.PAGE_LIMIT) {
          this.hasMore = true;
          return;
        }

        offer['nameCN'] = environment.unitData[offer.unitId].nameCN;
        offer['nameEN'] = environment.unitData[offer.unitId].nameEN;
        offer['imagePath'] = environment.unitData[offer.unitId].imagePath;

        // offer.price = offer.price
        // offer.level = offer.level
        // offer.page = offer.page

        offer['bought'] = this._unitIdExists(offer.unitId);
        offer['isMe'] = this.contractService.isMe(offer.seller);

        this.unitOffers.push(offer);
      });
    });
  }

  showItemOffers(page: number) {
    if (page < 1) return;

    this.currentPage = page;

    const offset = this.PAGE_LIMIT * (page - 1);
    this.hasMore = false;

    this.itemOffers = [];

    this.waiting = true;
    this.itemManager.getOfferArray(
        this.gateService,
        this.sortByPrice,
        this.filterSeller,
        this.filterItemId,
        this.PAGE_LIMIT + 1, offset).then(offers => {
      this.waiting = false;
      offers.map((offer, i) => {
        if (i >= this.PAGE_LIMIT) {
          this.hasMore = true;
          return;
        }

        offer['nameCN'] = environment.itemData[offer.itemId].nameCN;
        offer['nameEN'] = environment.itemData[offer.itemId].nameEN;
        offer['imagePath'] = environment.itemData[offer.itemId].imagePath;
        offer['isMountable'] = environment.itemData[offer.itemId].isMountable;
      
        // offer.price = offer.price
        // offer.level = offer.level
        // offer.score = offer.score
        // offer.page = offer.page
      
        offer['bought'] = this._itemRIdExists(offer.rId);
        offer['isMe'] = this.contractService.isMe(offer.seller);
      
        this.itemOffers.push(offer);
      });
    });
  }

  startTrial(option: number) {
    this.waiting = true;
    this.contractService.startTrial(option).then(unitIdArray => {
      // Refresh.
      unitIdArray.forEach(unitId => {
        for (let i = 0; i < this.profile.units.length; ++i) {
          if (this.profile.units[i].unitId == unitId) {
            return;
          }
        }

        // Refresh my heroes and defense.
        this.unitManager.getMyOneUnit(this.itemManager, unitId).then(unit => {
          this.profile.units.push(unit);
        });
      });

      this.unitManager.getDefenseUnitIdArray().then(unitIdArray => {
        this.profile['defense'] = unitIdArray;
      });

      this.showAlert('购买成功', 'Bought successfully',
                     '',
                     '');

      this.waiting = false;
    }, err => {
      if (err.indexOf('balance not enough') >= 0) {
        this.showAlert('余额不足', 'Balance not enough',
            '您钱包中的IOST余额不足', 'You don\'t have enough IOST');
      } else if (err.indexOf('gas not enough') >= 0) {
        this.showAlert('Gas不足', 'Gas not enough',
            '请通过抵押获得更多', 'Please pledge IOST to get more');
      } else if (err.indexOf('already did trial') >= 0) {
        this.showAlert('您已经不是新用户', 'You are no longer a new user',
            '只有新用户可以获得1个体验包', 'Every new user can get only one starter kit');
      } else {
        this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      }

      this.waiting = false;
    });
  }

  showSellUnit() {
    this.willShowSellUnit = true;
  }

  showSellItem() {
    this.willShowSellItem = true;
  }

  showBuyItem() {
    this.willShowBuyItem = true;
  }

  showMarketInfo(unitId: number) {
    this.willShowMarketInfo = true;
    this.unitInfoId = unitId;
  }

  showMarketItemInfo(itemRId: number, seller: string) {
    this.willShowMarketItemInfo = true;
    this.itemInfoRId = itemRId;
    this.itemInfoSeller = seller;
  }

  onCloseAndRefresh($event) {
    this.willShowSellUnit = false;
    this.willShowSellItem = false;
    this.willShowBuyItem = false;

    if ($event.isPurchase) {
      this.showAlert('购买成功', 'Order placed', '买入' + $event.boughtAmount + '个，请刷新来查看。', 'Bought ' + $event.boughtAmount + '. Please refresh to view them');
    } else {
      this.showAlert('挂售成功', 'Order placed', '请刷新来查看', 'Please refresh to view it');
    }
  }

  onClose() {
    this.willShowSellUnit = false;
    this.willShowSellItem = false;
    this.willShowBuyItem = false;
    this.willShowMarketInfo = false;
    this.willShowMarketItemInfo = false;
  }

  buyUnitOffer(page: number, rId: number, price: number, unitId: number) {
    this.waiting = true;
    this.contractService.buyUnitOffer(page, rId, price).then(res => {
      this.waiting = false;

      if (res * 1) {
        this.showAlert('购买成功', 'Purchased successfully', '', '');

        // Refresh my heroes and defense.
        this.unitManager.getMyOneUnit(this.itemManager, unitId).then(unit => {
          this.profile.units.push(unit);
        });

        this.unitManager.getDefenseUnitIdArray().then(unitIdArray => {
          this.profile['defense'] = unitIdArray;
        });
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

  buyItemOffer(page: number, rId: number, price: number) {
    this.waiting = true;
    this.contractService.buyItemOffer(page, rId, price).then(res => {
      this.waiting = false;

      if (res * 1) {
        this.showAlert('购买成功', 'Purchased successfully', '', '');

        this.itemManager.getOneItem(rId).then(item => {
          this.profile.items.push(item);
        });
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

  changeLanguage(language: number) {
    this.language = language;

    if (this.marketSellUnit) {
      this.marketSellUnit.changeLanguage(language);
    }

    if (this.marketSellItem) {
      this.marketSellItem.changeLanguage(language);
    }

    if (this.marketBuyItem) {
      this.marketBuyItem.changeLanguage(language);
    }

    if (this.marketInfo) {
      this.marketInfo.changeLanguage(language);
    }

    if (this.marketItemInfo) {
      this.marketItemInfo.changeLanguage(language);
    }

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }

    if (this.loginBox) {
      this.loginBox.changeLanguage(language);
    }

    if (this.marketFilter) {
      this.marketFilter.changeLanguage(language);
    }

    if (this.priceBox) {
      this.priceBox.changeLanguage(language);
    }
  }

  cancelUnitOffer(unitId: number) {
    this.waiting = true;
    this.contractService.cancelUnitOffer(unitId).then(_ => {
      this.waiting = false;

      this.unitOffers = this.unitOffers.filter(offer => {
        return !this.contractService.isMe(offer.seller) ||
            offer.unitId != unitId;
      });
    }, err => {
      this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      this.waiting = false;
    });
  }

  cancelItemOffer(itemRId: number) {
    this.waiting = true;
    this.contractService.cancelItemOffer(itemRId).then(_ => {
      this.waiting = false;

      this.itemOffers = this.itemOffers.filter(offer => {
        return offer.rId != itemRId;
      });
    }, err => {
      this.showAlert('系统错误，请截屏发给管理员', 'System Error',
          err, err);
      this.waiting = false;
    });
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

  showLoginBox() {
    this.willShowLoginBox = true;
  }

  closeLoginBox() {
    this.willShowLoginBox = false;
  }

  showMarketFilter() {
    this.willShowMarketFilter = true;
  }

  closeMarketFilter() {
    this.willShowMarketFilter = false;
  }

  choosePriceRange($event) {
    this.willShowPriceBox = false;

    // Now buy from platform.
    const range = $event.value || 0;
    const price = +(this.platformUnitPrice * (1 + range / 100)).toFixed(3);

    this.buyUnitFromPlatform(this.platformUnitId, price);
  }

  closePriceBox() {
    this.willShowPriceBox = false;
  }
}
