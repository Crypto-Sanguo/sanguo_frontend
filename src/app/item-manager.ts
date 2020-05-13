import { environment } from '../environments/environment';

import { GateService } from './gate.service';


export class ItemManager {

  _iost: any = null;
  _itemCache: any = {};
  _itemIdByRIdCache: any = {};

  constructor(iost: any) {
    this._iost = iost;
  }

  async _getPages() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.itemManager, "pages", null, true);
    return JSON.parse(obj.data) || [];
  }

  async _getOffers(page: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.itemManager, "offers", page.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async _getItem(itemId: number) {
    if (this._itemCache[itemId]) {
      return this._itemCache[itemId];
    }

    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.itemManager, "item", itemId.toString(), true);
    const item = JSON.parse(obj.data) || 0;

    if (item) {
      this._itemCache[itemId] = item;
    }

    return item;
  }

  async getItem(itemId: number) {
    return await this._getItem(itemId);
  }

  async _getItemR(rId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.itemManager, "itemR", rId.toString(), true);
    const itemR = JSON.parse(obj.data) || {};

    if (itemR.itemId) {
      this._itemIdByRIdCache[rId] = itemR.itemId;
    }

    return itemR;
  }

  async _getUser(userName: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.itemManager, "user", userName, true);
    return JSON.parse(obj.data) || {};
  }

  async getOfferArray(gate: GateService, sortByPrice: number, seller: string, itemId: number, limit: number, offset: number) {
    const offers = await gate.getItems(sortByPrice, seller, itemId, limit, offset);
    const result = [];

    const all = offers.map(async (offer, i) => {
      // Populate values.
      const itemR = await this._getItemR(offer.rId);
      offer.level = itemR.level;
      offer.score = itemR.score;

      result[i] = offer;
    });

    await Promise.all(all);

    return result;
  }

  async getItemIdArrayFromRIdArray(itemRIdArray: Array<number>) {
    const all = itemRIdArray.map(async itemRId => {
      if (!itemRId) return 0;

      if (this._itemIdByRIdCache[itemRId]) return this._itemIdByRIdCache[itemRId];

      const itemR = await this._getItemR(itemRId);
      if (!itemR) return 0;

      return itemR.itemId;
    });

    return await Promise.all(all);
  }

  _value(value, level, score) {
    value = value || 0;
    return +(value * (1 + level / 2) * (1 + score / 100)).toFixed(0) || 0;
  }

  _worth(item, itemR) {
    return +(item.worth * itemR.level).toFixed(0) || 0;
  }

  async getSum(itemRIdArray: Array<number>, unitId: number) {
    var hp = 0;
    var attack = 0;
    var intelligence  = 0;
    var defense = 0;
    var agility = 0;
    var luck = 0;

    const all = itemRIdArray.map(async itemRId => {
      if (!itemRId) return;

      const itemR = await this._getItemR(itemRId);
      if (!itemR || !itemR.itemId) return;

      const item = await this._getItem(itemR.itemId);
      if (!item) return;

      let hpD, attackD, intelligenceD, defenseD, agilityD, luckD;
      if (item.unitIdS && item.unitIdS.indexOf(unitId * 1) >= 0) {
        hpD = (item.hp || 0) + (item.hpS || 0);
        attackD = (item.attack || 0) + (item.attackS || 0);
        intelligenceD = (item.intelligence || 0) + (item.intelligenceS || 0);
        defenseD = (item.defense || 0) + (item.defenseS || 0);
        agilityD = (item.agility || 0) + (item.agilityS || 0);
        luckD = (item.luck || 0) + (item.luckS || 0);
      } else {
        hpD = (item.hp || 0);
        attackD = (item.attack || 0);
        intelligenceD = (item.intelligence || 0);
        defenseD = (item.defense || 0);
        agilityD = (item.agility || 0);
        luckD = (item.luck || 0);
      }

      hp += this._value(hpD, itemR.level, itemR.score);
      attack += this._value(attackD, itemR.level, itemR.score);
      intelligence += this._value(intelligenceD, itemR.level, itemR.score);
      defense += this._value(defenseD, itemR.level, itemR.score);
      agility += this._value(agilityD, itemR.level, itemR.score);
      luck += this._value(luckD, itemR.level, itemR.score);
    });

    await Promise.all(all);

    return {
      hp: hp,
      attack: attack,
      intelligence: intelligence,
      defense: defense,
      agility: agility,
      luck: luck
    }
  }

  async getOneItem(rId: number) {
    return await this.getOneItemOf(rId, this._iost.currentAccount);
  }

  async getOneItemOf(rId: number, who: string) {
    const user = await this._getUser(who);

    const itemId = user[rId].itemId;
    const itemR = await this._getItemR(rId);
    const item = await this._getItem(itemId);

    return {
      rId: rId,
      itemId: itemId,
      isMountable: item.isMountable,
      positionIndex: item.positionIndex,
      level: itemR.level,
      score: itemR.score,
      hp: this._value(item.hp, itemR.level, itemR.score),
      attack: this._value(item.attack, itemR.level, itemR.score),
      intelligence: this._value(item.intelligence, itemR.level, itemR.score),
      defense: this._value(item.defense, itemR.level, itemR.score),
      agility: this._value(item.agility, itemR.level, itemR.score),
      luck: this._value(item.luck, itemR.level, itemR.score),
      unitIdS: item.unitIdS,
      hpS: this._value(item.hpS, itemR.level, itemR.score),
      attackS: this._value(item.attackS, itemR.level, itemR.score),
      intelligenceS: this._value(item.intelligenceS, itemR.level, itemR.score),
      defenseS: this._value(item.defenseS, itemR.level, itemR.score),
      agilityS: this._value(item.agilityS, itemR.level, itemR.score),
      luckS: this._value(item.luckS, itemR.level, itemR.score),
      worth: this._worth(item, itemR),
      mountedByUnitId: itemR.mountedByUnitId,
      forSale: user[rId].page && user[rId].page > 0,
      time: itemR.time,
      lastUnitId: itemR.lastUnitId
    };
  }

  async getMyItems() {
    const user = await this._getUser(this._iost.currentAccount);

    const result = [];

    const all = [];
    for (let rIdStr in user) {
      const rId: number = parseInt(rIdStr);
      all.push((async (rId) => {
        let itemId = user[rId].itemId;
        let itemR = await this._getItemR(rId);
        let item = await this._getItem(itemId);

        result.push({
          rId: rId,
          itemId: itemId,
          isMountable: item.isMountable,
          positionIndex: item.positionIndex,
          level: itemR.level,
          score: itemR.score,
          hp: this._value(item.hp, itemR.level, itemR.score),
          attack: this._value(item.attack, itemR.level, itemR.score),
          intelligence: this._value(item.intelligence, itemR.level, itemR.score),
          defense: this._value(item.defense, itemR.level, itemR.score),
          agility: this._value(item.agility, itemR.level, itemR.score),
          luck: this._value(item.luck, itemR.level, itemR.score),
          worth: this._worth(item, itemR),
          mountedByUnitId: itemR.mountedByUnitId,
          forSale: user[rId].page && user[rId].page > 0,
          time: itemR.time,
          lastUnitId: itemR.lastUnitId
        });
      }) (rId));
    }

    await Promise.all(all);

    return result;
  }

  async getMyItemsByRIdArray(rIdArray) {
    const user = await this._getUser(this._iost.currentAccount);
    const result = [];

    const all = rIdArray.map(async rId => {
      const itemR = await this._getItemR(rId);
      const itemId = itemR.itemId;
      const item = await this._getItem(itemId);

      result.push({
        rId: rId,
        itemId: itemId,
        isMountable: item.isMountable,
        positionIndex: item.positionIndex,
        level: itemR.level,
        score: itemR.score,
        hp: this._value(item.hp, itemR.level, itemR.score),
        attack: this._value(item.attack, itemR.level, itemR.score),
        intelligence: this._value(item.intelligence, itemR.level, itemR.score),
        defense: this._value(item.defense, itemR.level, itemR.score),
        agility: this._value(item.agility, itemR.level, itemR.score),
        luck: this._value(item.luck, itemR.level, itemR.score),
        unitIdS: item.unitIdS,
        hpS: this._value(item.hpS, itemR.level, itemR.score),
        attackS: this._value(item.attackS, itemR.level, itemR.score),
        intelligenceS: this._value(item.intelligenceS, itemR.level, itemR.score),
        defenseS: this._value(item.defenseS, itemR.level, itemR.score),
        agilityS: this._value(item.agilityS, itemR.level, itemR.score),
        luckS: this._value(item.luckS, itemR.level, itemR.score),
        worth: this._worth(item, itemR),
        mountedByUnitId: itemR.mountedByUnitId,
        forSale: user[rId].page && user[rId].page > 0,
        time: itemR.time,
        lastUnitId: itemR.lastUnitId
      });
    });

    await Promise.all(all);

    return result;
  }
};
