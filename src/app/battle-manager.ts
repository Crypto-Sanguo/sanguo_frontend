import { environment } from '../environments/environment';


export class BattleManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getHistory() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.battle, "history", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || [];
  }

  async canAttackObj() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.battle, "time", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || {attack: 0, attackCount: 0, attackPaid: 0};
  }

  async canDefenseObj(who: string) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.battle, "time", who, true);
    return JSON.parse(obj.data) || {attack: 0, defense: 0, defenseCount: 0};
  }
};
