import { environment } from '../environments/environment';


export class TreasureManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  _ceilDate(time) {
    if (time < 46800) return 0;
    return Math.ceil((time - 46800) / 86400);
  }

  _ceilWeek(time) {
    return Math.ceil(time / 86400 / 7);
  }

  async getToday() {
    const now = Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
    return this._ceilDate(now);
  }

  async getThisWeek() {
    const now = Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
    return this._ceilWeek(now - 108000);
  }

  async getTodayAndThisWeek() {
    const now = Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
    return [this._ceilDate(now), this._ceilWeek(now - 108000)];
  }

  async getRemainingTime() {
    const now = Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
    return [86400 - (now - 46800) % 86400, 604800 - (now - 108000) % 604800];
  }

  async getMyBalance() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "balance", this._iost.currentAccount, true);
    return +JSON.parse(obj.data) || 0;
  }

  async getBalanceOf(who) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "balance", who, true);
    return +JSON.parse(obj.data) || 0;
  }

  async getPool1(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "pool1", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getPool2(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "pool2", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getPool3(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "pool3", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getPool4(thisWeek) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "pool4", thisWeek.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getHoldingAll(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "holdingAll", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getBurningAll(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "burningAll", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getPowerAll(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "powerAll", today.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getLandAll(thisWeek) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "landAll", thisWeek.toString(), true);
    return +JSON.parse(obj.data) || 0;
  }

  async getHolding(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "holding_points", this._iost.currentAccount, true);
    const arr = JSON.parse(obj.data);
    return arr ? arr[arr.length - 1][1] : 0;
  }

  async getBurning(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "burning_points", this._iost.currentAccount, true);
    const arr = JSON.parse(obj.data);
    if (arr) {
      return arr[arr.length - 1][0] == today ? arr[arr.length - 1][1] : 0;
    } else {
      return 0;
    }
  }

  async getPower(today) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "power_points", this._iost.currentAccount, true);
    const arr = JSON.parse(obj.data);
    if (arr) {
      return arr[arr.length - 1][0] == today ? arr[arr.length - 1][1] : 0;
    } else {
      return 0;
    }
  }

  async getLand(thisWeek) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "land_points", this._iost.currentAccount, true);
    const arr = JSON.parse(obj.data);
    if (arr) {
      return arr[arr.length - 1][0] == thisWeek ? arr[arr.length - 1][1] : 0;
    } else {
      return 0;
    }
  }

  async _getClearance() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "clearance", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || {value: 0, day: 0, week: 0};
  }

  async _getHoldingPoints() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "holding_points", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async _getBurningPoints() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "burning_points", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async _getPowerPoints() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "power_points", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async _getLandPoints() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "land_points", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async getReferralBonus() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "referralBonus", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || 0;
  }

  async getHoldingDividends(today, limit) {
    const result = [];

    const holdingPoints = await this._getHoldingPoints();
    if (holdingPoints.length == 0) {
      for (i = 0; i < limit; ++i) {
        result.push(0);
      }

      return result;
    }

    var cur = holdingPoints.length - 1;

    var i;

    const all = [];
    var count = 0;

    for (i = today - 1; i >= today - limit; --i) {
      const day = holdingPoints[cur][0];
      // Moves the cursor one position forward is enough.
      if (day > i) --cur;

      if (cur < 0) {
        // No more dividends before the day.
        break;
      }

      all.push((async (i, cur, count) => {
        const pool = await this.getPool1(i);
        const holdingAll = await this.getHoldingAll(i) || 1;
        result[count] = holdingPoints[cur][1] * pool / holdingAll;
      }) (i, cur, count));

      ++count;
    }
    await Promise.all(all);

    const remainingLength = limit - result.length;
    for (i = 0; i < remainingLength; ++i) {
      result.push(0);
    }

    return result;
  }

  async canShowBurningDividends() {
    const burningPoints = await this._getBurningPoints();
    return burningPoints.length > 0;
  }

  async getBurningDividends(today, limit) {
    const result = [];

    const burningPoints = await this._getBurningPoints();

    const all = [];

    let count = 0;

    for (let i = burningPoints.length - 1; i >= 0; --i) {
      const day = burningPoints[i][0];
      if (day >= today) continue;

      if (day < today - limit) break;

      all.push((async (day,i, count) => {
        const pool = await this.getPool2(day);
        const burningAll = await this.getBurningAll(day) || 1;
        result[count] = {
          day: day,
          dividend: +(burningPoints[i][1] * pool / burningAll).toFixed(3)
        };
      }) (day, i, count));

      ++count;
    }

    await Promise.all(all);

    return result;
  }

  async getPowerDividends(today, limit) {
    const result = [];

    const powerPoints = await this._getPowerPoints();

    const all = [];

    let count = 0;

    for (let i = powerPoints.length - 1; i >= 0; --i) {
      const day = powerPoints[i][0];
      if (day >= today) continue;

      if (day < today - limit) break;

      all.push((async (day,i, count) => {
        const pool = await this.getPool3(day);
        const powerAll = await this.getPowerAll(day) || 1;
        result[count] = {
          day: day,
          dividend: +(powerPoints[i][1] * pool / powerAll).toFixed(3)
        };
      }) (day, i, count));

      ++count;
    }

    await Promise.all(all);

    return result;
  }

  async getLandDividends(thisWeek, limit) {
    const result = [];

    const landPoints = await this._getLandPoints();

    const all = [];

    let count = 0;

    for (let i = landPoints.length - 1; i >= 0; --i) {
      const week = landPoints[i][0];
      if (week >= thisWeek) continue;

      if (week < thisWeek - limit) break;

      all.push((async (week, i, count) => {
        const pool = await this.getPool4(week);
        const landAll = await this.getLandAll(week) || 1;
        result[count] = {
          week: week,
          dividend: +(landPoints[i][1] * pool / landAll).toFixed(3)
        };
      }) (week, i, count));

      ++count;
    }

    await Promise.all(all);

    return result;
  }

  async getDividendValue() {
    const clearance = await this._getClearance();
    clearance.week = clearance.week || 0;

    var today;
    var thisWeek;
    var holdingPoints;
    var burningPoints;
    var powerPoints;
    var landPoints;

    const preAll = [
      (async () => {
        const tmp = await this.getTodayAndThisWeek();
        today = tmp[0];
        thisWeek = tmp[1];
      }) (),
      (async () => {
        holdingPoints = await this._getHoldingPoints();
      }) (),
      (async () => {
        burningPoints = await this._getBurningPoints();
      }) (),
      (async () => {
        powerPoints = await this._getPowerPoints();
      }) (),
      (async () => {
        landPoints = await this._getLandPoints();
      }) ()
    ];
    await Promise.all(preAll);

    const array = [clearance.value];
    const all = [];

    if (holdingPoints.length) {
      for (let i = holdingPoints.length - 1; i >=0; --i) {
        if (holdingPoints[i][0] >= clearance.day ||
            (i + 1 < holdingPoints.length && holdingPoints[i + 1][0] >= clearance.day)) {
          const start = Math.max(clearance.day, holdingPoints[i][0]);

          let end;
          if (i + 1 < holdingPoints.length) {
            end = holdingPoints[i + 1][0];
          } else {
            end = today;
          }

          for (let j = start; j < end; ++j) {
            all.push((async j => {
              const pool = await this.getPool1(j);
              const holdingAll = await this.getHoldingAll(j) || 1;
              array.push(holdingPoints[i][1] * pool / holdingAll);
            }) (j));
          }
        } else {
          break;
        }
      }
    }

    if (burningPoints.length) {
      for (let i = burningPoints.length - 1; i >= 0; --i) {
        const day = burningPoints[i][0];
        if (day >= today) continue;

        if (day >= clearance.day) {
          all.push((async (day, i) => {
            const pool = await this.getPool2(day);
            const burningAll = await this.getBurningAll(day) || 1;
            array.push(burningPoints[i][1] * pool / burningAll);
          }) (day, i));
        } else {
          break;
        }
      }
    }

    if (powerPoints.length) {
      for (let i = powerPoints.length - 1; i >= 0; --i) {
        const day = powerPoints[i][0];
        if (day >= today) continue;

        if (day >= clearance.day) {
          all.push((async (day, i) => {
            const pool = await this.getPool3(day);
            const powerAll = await this.getPowerAll(day) || 1;
            array.push(powerPoints[i][1] * pool / powerAll);
          }) (day, i));
        } else {
          break;
        }
      }
    }


    if (landPoints.length) {
      for (let i = landPoints.length - 1; i >= 0; --i) {
        const week = landPoints[i][0];
        if (week >= thisWeek) continue;

        if (week >= clearance.week) {
          all.push((async (week, i) => {
            const pool = await this.getPool4(week);
            const landAll = await this.getLandAll(week) || 1;
            array.push(landPoints[i][1] * pool / landAll);
          }) (week, i));
        } else {
          break;
        }
      }
    }

    await Promise.all(all);

    var total = 0;

    array.forEach(v => {
      total += v;
    });

    return total;
  }

  async getMyTeam(tier: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "referralTeam" + tier, this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async getReferralSpent(who: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.treasureManager, "referralSpent", who, true);
    return +(obj.data) || 0;
  }
};
