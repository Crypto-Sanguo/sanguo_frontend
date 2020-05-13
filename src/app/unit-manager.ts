import { environment } from '../environments/environment';

import { GateService } from './gate.service';

import { ItemManager } from './item-manager';


const MAX_ENERGY = 10;


export class UnitManager {

  _iost: any = null;
  _unitCache: any = {};

  constructor(iost: any) {
    this._iost = iost;
  }

  async _getPages() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "pages", null, true);
    return JSON.parse(obj.data) || [];
  }

  async _getOffers(page: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "offers", page.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async _getUnit(unitId: number) {
    if (this._unitCache[unitId]) {
      return this._unitCache[unitId];
    }

    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "unit", unitId.toString(), true);
    const unit = JSON.parse(obj.data) || 0;

    if (unit) {
      this._unitCache[unitId] = unit;
    }

    return unit;
  }

  async _getUnitR(rId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "unitR", rId.toString(), true);
    return JSON.parse(obj.data) || {};
  }

  async _getUser(userName: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "user", userName, true);
    return JSON.parse(obj.data) || {};
  }

  async getDefenseUnitIdArray() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "defense", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [0, 0, 0];
  }

  async getDefenseUnitIdArrayOf(who: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "defense", who, true);
    return JSON.parse(obj.data) || [0, 0, 0];
  }

  async getUnitArray(unitIdArray: Array<number>) {
    const user = await this._getUser(this._iost.currentAccount);

    const result = [];

    const all = unitIdArray.map(async unitId => {
      const unit = await this._getUnit(unitId);
      if (!unit) {
        return;
      }

      unit.unitId = unitId;

      if (user) {
        unit.bought = user[unitId] ? 1 : 0;
      }

      result.push(unit);
    });

    await Promise.all(all);

    return result;
  }

  async getOfferArray(gate: GateService, sortByPrice: number, seller: string, unitId: number, limit: number, offset: number) {
    const offers = await gate.getUnits(sortByPrice, seller, unitId, limit, offset);
    const result = [];

    const all = offers.map(async (offer, i) => {
      // Populate values.
      const unitR = await this._getUnitR(offer.rId);
      offer.level = unitR.level;

      result[i] = offer;
    });

    await Promise.all(all);

    return result;
  }

  _hp(unit, level) {
    return +(unit.hp + unit.hpStep * level).toFixed(0) || 0;
  }

  _attack(unit, level) {
    return +(unit.attack + unit.attackStep * level).toFixed(0) || 0;
  }

  _intelligence(unit, level) {
    return +(unit.intelligence + unit.intelligenceStep * level).toFixed(0) || 0;
  }

  _defense(unit, level) {
    return +(unit.defense + unit.defenseStep * level).toFixed(0) || 0;
  }

  _agility(unit, level) {
    return +(unit.agility + unit.agilityStep * level).toFixed(0) || 0;
  }

  _luck(unit, level) {
    return +(unit.luck + unit.luckStep * level).toFixed(0) || 0;
  }

  _recoverCost(unit, level) {
    // Fixed cost of 20 IOST.
    return 20;
  }

  _upgradeCost(unit, level) {
    let cost = unit.upgradeCost;

    for (let i = 1; i < level; ++i) {
      cost = cost * 11 / 10;
    }

    return +(cost).toFixed(0);
  }

  async _realEnergy(energy) {
    const now = Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);

    const realAmount = energy.amount + Math.floor((now - energy.time) / (3600));

    if (realAmount >= MAX_ENERGY) {
      return {
        amount: MAX_ENERGY,
        duration: 0,
        now: now
      };
    } else {
      return {
        amount: realAmount,
        duration: Math.floor(((now - energy.time) % (3600))),
        now: now
      };
    }
  }

  async getMyOneUnit(itemManager: ItemManager, unitId: number) {
    const user = await this._getUser(this._iost.currentAccount);
    let rId = user[unitId].rId;
    let unitR = await this._getUnitR(rId);
    let unit = await this._getUnit(unitId);

    const mounted = await itemManager.getItemIdArrayFromRIdArray(user[unitId].itemRIdArray);
    const sum = await itemManager.getSum(user[unitId].itemRIdArray, unitId);

    const res = {
      rId: rId,
      unitId: unitId,
      level: unitR.level,
      unlock: unitR.unlock,
      mounted: mounted,
      hp: this._hp(unit, unitR.level),
      hpP: sum.hp,
      attack: this._attack(unit, unitR.level),
      attackP: sum.attack,
      intelligence: this._intelligence(unit, unitR.level),
      intelligenceP: sum.intelligence,
      defense: this._defense(unit, unitR.level),
      defenseP: sum.defense,
      agility: this._agility(unit, unitR.level),
      agilityP: sum.agility,
      luck: this._luck(unit, unitR.level),
      luckP: sum.luck,
      recoverCost: this._recoverCost(unit, unitR.level),
      upgradeCost: this._upgradeCost(unit, unitR.level),
      energy: await this._realEnergy(unitR.energy),
      forSale: user[unitId].page && user[unitId].page > 0
    };

    this._getRecoverInfo().then(async info => {
      const now = await this.getNow();
      const beginOfToday = now - now % (3600 * 24);
      res.energy['canRecover'] = !info[res.unitId] || info[res.unitId].length < 3 || info[res.unitId][0] < beginOfToday;
    });

    return res;
  }

  async getPlayerUnits(itemManager: ItemManager, who: string) {
    const user = await this._getUser(who);

    const result = [];

    const all = [];

    for (let unitId in user) {
      all.push((async (unitId) => {
        let rId = user[unitId].rId;
        let unitR = await this._getUnitR(rId);
        let unit = await this._getUnit(parseInt(unitId));

        const mounted = await itemManager.getItemIdArrayFromRIdArray(user[unitId].itemRIdArray);
        const sum = await itemManager.getSum(user[unitId].itemRIdArray, parseInt(unitId));

        result.push({
          rId: rId,
          unitId: unitId,
          level: unitR.level,
          unlock: unitR.unlock,
          mounted: mounted,
          hp: this._hp(unit, unitR.level),
          hpP: sum.hp,
          attack: this._attack(unit, unitR.level),
          attackP: sum.attack,
          intelligence: this._intelligence(unit, unitR.level),
          intelligenceP: sum.intelligence,
          defense: this._defense(unit, unitR.level),
          defenseP: sum.defense,
          agility: this._agility(unit, unitR.level),
          agilityP: sum.agility,
          luck: this._luck(unit, unitR.level),
          luckP: sum.luck,
          recoverCost: this._recoverCost(unit, unitR.level),
          upgradeCost: this._upgradeCost(unit, unitR.level),
          energy: await this._realEnergy(unitR.energy),
          forSale: user[unitId].page && user[unitId].page > 0
        });
      }) (unitId));
    }

    await Promise.all(all);

    return result;
  }

  async getNow() {
    return Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
  }

  async getMyUnits(itemManager: ItemManager, now: number) {
    const units = await this.getPlayerUnits(itemManager, this._iost.currentAccount);

    this._getRecoverInfo().then(async info => {
      const now = await this.getNow();
      const beginOfToday = now - now % (3600 * 24);

      units.forEach(unit => {
        unit.energy.canRecover = !info[unit.unitId] || info[unit.unitId].length < 3 || info[unit.unitId][0] < beginOfToday;
      });
    });

    return units;
  }

  async getMyUnitIdArray() {
    const user = await this._getUser(this._iost.currentAccount);
    const result = [];
    for (let unitId in user) {
      result.push(unitId);
    }
    return result;
  }

  async getPeerStatusLite(itemManager: ItemManager, who: string) {
    const unitIdArray = await this._getDefenseUnitIdArray(who);

    let i;

    const user = await this._getUser(who);

    const result = [];
    const all = unitIdArray.map(async (unitId, i) => {
      if (!unitId || !user[unitId]) {
        result[i] = {
          rId: 0,
          unitId: 0,
          level: 0,
          hp: 0
        };

        return;
      }

      const rId = user[unitId].rId;
      const unitR = await this._getUnitR(rId);
      const unit = await this._getUnit(unitId);

      const sum = await itemManager.getSum(user[unitId].itemRIdArray, unitId);

      const hp = this._hp(unit, unitR.level) + sum.hp;

      result[i] = {
        rId: rId,
        unitId: unitId,
        level: unitR.level,
        hp: hp
      };
    });

    await Promise.all(all);

    return result;
  }

  async getPeerStatusPro(itemManager: ItemManager, who: string, unitIdArray: Array<number>) {
    let i;

    const user = await this._getUser(who);

    const result = [];
    const all = unitIdArray.map(async (unitId, i) => {
      if (!unitId || !user[unitId]) {
        result[i] = {
          rId: 0,
          unitId: 0,
          level: 0,
          hp: 0
        };

        return;
      }

      const rId = user[unitId].rId;
      const unitR = await this._getUnitR(rId);
      const unit = await this._getUnit(unitId);

      const sum = await itemManager.getSum(user[unitId].itemRIdArray, unitId);

      const hp = this._hp(unit, unitR.level) + sum.hp;

      result[i] = {
        rId: rId,
        unitId: unitId,
        level: unitR.level,
        hp: hp
      };
    });

    await Promise.all(all);

    return result;
  }

  async _getAllValues(type) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.rankManager, "all_values", type, true);
    return JSON.parse(obj.data) || [];
  }

  async _getDefenseUnitIdArray(who: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "defense", who, true);
    return JSON.parse(obj.data) || [0,0,0];
  }

  async _getBalance(who: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "balance", who, true);
    return JSON.parse(obj.data) || 0;
  }

  async _getCountOfFarms(who) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "user", who, true);
    const user = JSON.parse(obj.data) || {units: []};

    var farms = [];
    for (let unitId in user.units) {
      let landId = user.units[unitId];
      if (landId) {
        if (farms.indexOf(landId) < 0) {
          farms.push(landId);
        }
      }
    }
    return farms.length;
  }

  async getUsersWithNoFarms(gate: GateService, limit: number, offset: number) {
    var data = await gate.getUsersWithNoFarms(limit, offset);

    const result = [];

    const all = data.map(async (pair, i) => {
      const who = pair[0];
      const user = await this._getUser(who);

      const unitIdArray = await this._getDefenseUnitIdArray(who);
      const units = unitIdArray.map(unitId => {
        if (!unitId || !user[unitId]) {
          return {
            unitId: 0,
            level: 0
          }
        }

        const unitValue: any = {
          unitId: unitId
        }

        const rId = user[unitId].rId;
        this._getUnitR(rId).then(unitR => {
          unitValue.level = unitR.level;
        });

        return unitValue;
      });

      result[i] = {
        name: who,
        units: units,
        balance: 0,
        isMe: who == this._iost.currentAccount ? 1 : 0
      };

      this._getCountOfFarms(who).then(count => {
        if (!count) {
          result[i].balance = pair[1];
        }
      });
    });

    await Promise.all(all);

    return result;
  }

  async getPeersAndUpdateMyStat(gate: GateService, type: string, limit: number, offset: number, stat: any) {
    var data = await gate.getRankData(type, limit, offset, this._iost.currentAccount);

    stat['rank_' + type] = data[0];
    stat['sum_' + type] = data[1];
    const allValues = data[2];

    const result = [];

    const all = allValues.map(async (pair, i) => {
      const who = pair[0];
      const user = await this._getUser(who);

      const unitIdArray = await this._getDefenseUnitIdArray(who);
      const units = unitIdArray.map(unitId => {
        if (!unitId || !user[unitId]) {
          return {
            unitId: 0,
            level: 0
          }
        }

        const unitValue: any = {
          unitId: unitId
        }

        const rId = user[unitId].rId;
        this._getUnitR(rId).then(unitR => {
          unitValue.level = unitR.level;
        });

        return unitValue;
      });

      result[i] = {
        name: who,
        units: units,
        balance: 0,
        value: pair[1],
        isMe: who == this._iost.currentAccount ? 1 : 0
      };

      if (type == "balance") {
        result[i].balance = pair[1];
      } else {
        this._getBalance(who).then(b => {
          result[i].balance = b;
        });
      }
    });

    await Promise.all(all);

    return result;
  }

  async getMyValues(gate: GateService) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.rankManager, "value", this._iost.currentAccount, true);
    const data = JSON.parse(obj.data) || {
      rank_score: 0,
      rank_balance: 0,
      rank_revenue: 0,
      rank_spending: 0,
      rank_power: 0,
      score: 0,
      balance: 0,
      revenue: 0,
      spending: 0,
      power: 0
    };

    setTimeout(async () => {
      const res = await gate.getRankData("power", 10, 0, this._iost.currentAccount);
      data['rank_power'] = res[0];
      data['sum_power'] = res[1];
    }, 0);

    return data;
  }

  async getHp(unitId: number, level: number) {
    const unit = await this._getUnit(unitId);
    if (!unit) return 0;
    return +(unit.hp + unit.hpStep * level).toFixed(0);
  }

  async getUnit(unitId: number) {
    return await this._getUnit(unitId);
  }

  async _getRecoverInfo() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.unitManager, "recover_info", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || 0;
  }

  async canRecover(now: number, unitId: number) {
    const info = await this._getRecoverInfo();
    const beginOfToday = now - now % (3600 * 24);
    return info[unitId].length < 3 || info[unitId][0] < beginOfToday;
  }
};
