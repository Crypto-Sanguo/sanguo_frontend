import { environment } from '../environments/environment';


export class LotteryManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getLotteryTicketAmount() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.lotteryManager, "ticket", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || 0;
  }

  async getBadLuckStore() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.lotteryManager, "badLuckStore", null, true);
    return JSON.parse(obj.data) || {items: [], units: []};
  }

  async getBadLuck() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.lotteryManager, "badLuck", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || 0;
  }

  async getXMasResults() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.lotteryManager, "xMasResults", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getXMasQueue() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.lotteryManager, "xMasQueue", null, true);
    return JSON.parse(obj.data) || [];
  }
};
