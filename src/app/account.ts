import { environment } from '../environments/environment';


export class Account {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getNow() {
    return Math.floor((+(await this._iost.rpc.blockchain.getChainInfo()).head_block_time) / 1e9);
  }

  async hasStarted() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.account, "game", this._iost.currentAccount, true);
    return JSON.parse(obj.data) || 0;
  }
};
