import { environment } from '../environments/environment';

import { TreasureManager } from './treasure-manager';


export class LandManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async _getLand(landId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "land", landId.toString(), true);
    return JSON.parse(obj.data) || {};
  }

  async getLand(landId: number) {
    return await this._getLand(landId);
  }

  async _getCity(cityId) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "city", cityId.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async _getUser(who) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "user", who, true);
    return JSON.parse(obj.data) || [];
  }

  async getAllCityIds() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "all_city_ids", null, true);
    return JSON.parse(obj.data) || [];
  }

  async _getStat() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "stat", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getTaxRecord(cityId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "taxRecord", cityId.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async getPool(cityId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "pool", cityId.toString(), true);
    return JSON.parse(obj.data) || {};
  }

  async _getPrize(cityId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "prize", cityId.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  _ceilDate(time) {
    if (time < 46800) return 0;
    return Math.ceil((time - 46800) / 86400);
  }

  async getMyAttackPoint() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "attack_points_by_user", this._iost.currentAccount, true);
    const res = JSON.parse(obj.data) || {};

    const today = this._ceilDate(Math.floor((new Date()).getTime() / 1000));

    if (res.date == today) {
      return res.count;
    } else {
      return 0;
    }
  }

  async getSumOfAttackPoint() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "attack_points_by_user", "SUM", true);
    const res = JSON.parse(obj.data) || {};
    return res.count || 0;
  }

  async getOneCity(cityId) {
    const res: any = await this._getCity(cityId);
    res.cityId = cityId;
    return res;
  }

  async getAllCities() {
    const ids = await this.getAllCityIds();
    const cities = ids.map(cityId => {
      const city: any = {
        cityId: cityId,
        loading: true
      };

      this._getCity(cityId).then(data => {
        city.loading = false;
        city.owner = data.owner;
        city.landIdArray = data.landIdArray;
        city.taxRate = data.taxRate;
        city.taxRateTime = data.taxRateTime;
        city.defeat = data.defeat;
      });

      return city;
    });
    return cities;
  }

  async getMyLands(begin: number, end: number, treasureManager?: TreasureManager) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "user", this._iost.currentAccount, true);
    const user = JSON.parse(obj.data) || {landIds:[]};
    return await this.getLandsByIds(user.landIds.slice(begin, end), treasureManager);
  }

  async getLandsInCity(cityId: number, begin: number, end: number, treasureManager?: TreasureManager) {
    const city = await this._getCity(cityId);
    return await this.getLandsByIds(city.landIdArray.slice(begin, end), treasureManager);
  }

  async getLandsByIds(landIdArray: Array<number>, treasureManager?: TreasureManager) {
    const farmCount = {};
    const farmBalance = {};

    const landArray = landIdArray.map(landId => {
      const land: any = {
        landId: landId,
        loading: true,
        balanceLoading: true
      };

      this._getLand(landId).then(async data => {
        land.loading = false;
        land.unitIdArray = data.unitIdArray;
        land.owner = data.owner;
        land.renter = data.renter;
        land.oath = data.oath;
        land.expiration = data.expiration;
        land.cityId = data.cityId;
        land.cityIdTime = data.cityIdTime;
        land.sellPage = data.sellPage;
        land.rentPage = data.rentPage;
        land.defense = data.defense;
        land.defenseCount = data.defenseCount;

        // Populate balance.
        if (!treasureManager) return;

        let who;
        if (land.renter) {
          who = land.renter;
        } else {
          who = land.owner;
        }

        let hasUnit = 0;
        for (let i = 0; i < land.unitIdArray.length; ++i) {
          if (land.unitIdArray[i]) {
            hasUnit = 1;
          }
        }

        if (!hasUnit) {
          land.balance = 0;
          land.balanceLoading = false;
          return;
        }

        if (!farmCount[who]) {
          farmCount[who] = await this.countOfFarms(who);
          farmBalance[who] = await treasureManager.getBalanceOf(who);
        }

        land.balance = farmCount[who] ? Math.floor(farmBalance[who] / farmCount[who]) : 0;
        land.balanceLoading = false;
      });

      return land;
    });

    return landArray;
  }

  async countOfFarms(who) {
    const user = await this._getUser(who);

    if (!user) return 0;

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

  async estimateCityPrice(size) {
    const stat = await this._getStat();
    var total = 0;
    for (let i = 0; i < size; ++i) {
      total += stat.price;
      ++stat.price;
    }
    return total;
  }

  async getAttackPoints(cityId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "attack_points", cityId.toString(), true);
    const data = JSON.parse(obj.data) || {};
    const res = [];
    for (let who in data) {
      res.push([who, data[who]]);
    }
    res.sort((a, b) => b[1] - a[1]);
    return res;
  }

  async getDefensePoints(cityId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.landManager, "defense_points", cityId.toString(), true);
    const data = JSON.parse(obj.data) || {};
    const res = [];
    for (let who in data) {
      res.push([who, data[who]]);
    }
    res.sort((a, b) => b[1] - a[1]);
    return res;
  }

  async getUserLandInfo(who: string) {
    const user = await this._getUser(who);

    const res = {};

    for (let unitId in user.units) {
      const landId = user.units[unitId];
      if (landId && !res[landId]) {
        const land = await this._getLand(landId);
        res[landId] = land.cityId;
      }
    }

    return res;
  }
};
