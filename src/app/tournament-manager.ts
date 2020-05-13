import { environment } from '../environments/environment';


export class TournamentManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getHistory() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "history", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getQueue() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "queue", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getRecords(index: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "records", index.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async getTournamentStatus() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "result", null, true);
    return JSON.parse(obj.data) || [];
  }

  async getReward() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "reward", null, true);
    return JSON.parse(obj.data) || {};
  }

  async getTimes() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.tournamentManager, "times", null, true);
    return JSON.parse(obj.data) || {};
  }
};
