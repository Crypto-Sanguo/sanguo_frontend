import { environment } from '../environments/environment';


export class EpicManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getHistory() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "history", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getQueue() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "queue", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getRecords(index: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "records", index.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async getBossStatus() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "bossStatus", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getInformation() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "information", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getAward() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.epicManager, "award", null, true);
    return JSON.parse(obj.data) || [];
  }
};
