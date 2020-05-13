import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import { ContractService } from '../contract.service';

import { environment } from '../../environments/environment';

import { ItemManager } from '../item-manager';

@Component({
  selector: 'app-gear-synthesise',
  templateUrl: './gear-synthesise.component.html',
  styleUrls: ['./gear-synthesise.component.css']
})
export class GearSynthesiseComponent implements OnInit {

  @Input() profile: any;

  @ViewChild('gearInfo') gearInfo;
  @ViewChild('alertMessage') alertMessage;

  @Output() onRefreshItems: EventEmitter<any> = new EventEmitter();
  @Output() onRefreshBottomBar: EventEmitter<any> = new EventEmitter();
  @Output() onGoBack: EventEmitter<any> = new EventEmitter();

  tabId = 0;
  currentList = [];
  futureList = [];

  willShowGearInfo: boolean = false;
  itemToShow: any;

  itemManager: any = null;

  language: number = 0;

  willShowAlertMessage:boolean = false;
  alertTitleCN: string = '';
  alertTitleEN: string = '';
  alertBodyCN: string = '';
  alertBodyEN: string = '';

  waiting: boolean = false;

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    this.language = parseInt(localStorage.getItem('language'));

    this.itemManager = new ItemManager(this.contractService.myIOST);

    this.reloadData();
  }

  async reloadData() {
    this.currentList = [];
    this.futureList = [];

    const countMap = {};

    this.profile.items.map(item => {
      if (!countMap[item.itemId]) {
        countMap[item.itemId] = 1;
      } else {
        ++ countMap[item.itemId];
      }
    });

    for (let itemId in environment.itemData) {
      const item = this.profile.itemTemplates[itemId];

      if (!item || !item.components || item.components.length <= 0) {
        continue;
      }

      item.itemId = itemId;

      item.imagePath = environment.itemData[itemId].imagePath;
      item.nameCN = environment.itemData[itemId].nameCN;
      item.nameEN = environment.itemData[itemId].nameEN;
      item.descriptionCN = environment.itemData[itemId].descriptionCN;
      item.descriptionEN = environment.itemData[itemId].descriptionEN;

      let hasAll = true;

      for (let i = 0; i < item.components.length; ++i) {
        item.components[i].existing = Math.min(
            countMap[item.components[i].itemId] || 0, item.components[i].count);
        item.components[i].nameCN = environment.itemData[item.components[i].itemId].nameCN;
        item.components[i].nameEN = environment.itemData[item.components[i].itemId].nameEN;

        if (item.components[i].existing < item.components[i].count) {
          hasAll = false;
          item.components[i].ready = false;
        } else {
          item.components[i].ready = true;
        }
      }

      if (hasAll) {
        this.currentList.push(item);
      } else {
        this.futureList.push(item);
      }
    }

    this.currentList.sort((a, b) => a.itemId - b.itemId);
    this.futureList.sort((a, b) => a.itemId - b.itemId);
  }

  synthesize(item: any) {
    const itemRIdArray = [];
    const createdItemId = item.itemId;

    for (let i = 0; i < item.components.length; ++i) {
      let count = item.components[i].count;
      for (let j = 0; j < this.profile.items.length; ++j) {
        if (this.profile.items[j].itemId == item.components[i].itemId) {
          itemRIdArray.push(this.profile.items[j].rId);

          --count;

          if (count == 0) {
            break;
          }
        }
      }
    }

    this.waiting = true;

    this.contractService.synthesize(itemRIdArray, createdItemId).then(async createdRId => {
      // Remove old ones.
      this.profile.items = this.profile.items.filter(item => {
        return itemRIdArray.indexOf(item.rId) < 0;
      });

      // Load new one.
      this.profile.items.push(await this.itemManager.getOneItem(createdRId));

      this.alertTitleCN = '恭喜您';
      this.alertTitleEN = 'Succeeded';
      this.alertBodyCN = environment.itemData[createdItemId].nameCN + '合成成功。';
      this.alertBodyEN = environment.itemData[createdItemId].nameEN + ' is synthesized.';
      this.willShowAlertMessage = true;

      this.reloadData();

      this.waiting = false;
    }, err => {
      this.alertTitleCN = '合成失败';
      this.alertTitleEN = 'Synthesize failed';

      if (err.indexOf('gas not enough') >= 0) {
        this.alertBodyCN = 'Gas不足, 请通过抵押获得更多';
        this.alertBodyEN = 'You don\'t have enough gas, please pludge IOST to get more';
      } else {
        this.alertBodyCN = err;
        this.alertBodyEN = err;
      }

      this.willShowAlertMessage = true;

      this.onRefreshBottomBar.emit();
      this.waiting = false;
    });
  }

  gotoTab(tabId) {
    this.tabId = tabId;
  }

  goBack() {
    this.onGoBack.emit();
  }

  showGearInfo(item: any) {
    this.itemToShow = item;
    this.willShowGearInfo = true;
  }

  changeLanguage(language: number) {
    this.language = language;

    if (this.alertMessage) {
      this.alertMessage.changeLanguage(language);
    }

    if (this.gearInfo) {
      this.gearInfo.changeLanguage(language);
    }
  }

  onClose() {
    this.willShowAlertMessage = false;
    this.willShowGearInfo = false;
  }
}
