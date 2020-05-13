import { environment } from '../environments/environment';


export class NotificationManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async getNotifications() {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.notificationManager, "notification", this._iost.currentAccount, true);
    const data = JSON.parse(obj.data) || [];
    data.reverse();
    return data;
  }
};
