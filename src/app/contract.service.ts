import { Injectable } from '@angular/core';

import { environment } from '../environments/environment'


class Callback {

  map: any = {};

  constructor() {
  }

  on(msg, f) {
    this.map[msg] = f;
    return this;
  }

  pushMsg(msg, args) {
    const f = this.map[msg];
    if (f === undefined) {
      return
    }
    f(args)
  }
}


@Injectable({ providedIn: 'root' })
export class ContractService {

  myAddress: string = '';
  myIOST: any = null;

  constructor() {
  }

  async init() {
    if (window['IWalletJS']) {
      this.myIOST = window['IWalletJS'].newIOST(window['IOST']);

      this.myAddress = await window['IWalletJS'].enable();
      this.myIOST.setAccount(this.myAddress);
      this.myIOST.config.gasLimit = 2000000;

      return true;
    } else if (window['IWalletName'] && window['IWalletKey'] && window['IWalletUrl']) {
      const IOST = window['IOST'];
      
      // use RPC
      const rpc = new IOST.RPC(new IOST.HTTPProvider(window['IWalletUrl']));

      // init iost sdk
      this.myIOST = new IOST.IOST({ // will use default setting if not set
        gasRatio: 1,
        gasLimit: 2000000,
        delay:0,
      }, new IOST.HTTPProvider(window['IWalletUrl']));
      
      const account = new IOST.Account(window['IWalletName']);
      const kp = new IOST.KeyPair(this.decodeB58(window['IWalletKey']));

      account.addKeyPair(kp, "owner");
      account.addKeyPair(kp, "active");

      this.myIOST.signAndSend = (tx) => {
        const cb = new Callback();

        account.signTx(tx);
        const handler = new IOST.TxHandler(tx, rpc);
        handler.onPending(res => {
          if (res.pre_tx_receipt.status_code == "SUCCESS") {
            cb.pushMsg("success", res.pre_tx_receipt);
          } else {
            cb.pushMsg("failed", res.pre_tx_receipt);
          }
        }).onFailed(res => {
          cb.pushMsg("failed", "failed with error");
        }).send();

        return cb;
      };

      this.myIOST.setAccount(window['IWalletName']);
      this.myIOST.rpc = rpc;
      this.myIOST.setRPC(rpc);

      return true;
    } else {
      const IOST = window['IOST'];

      // use RPC
      const rpc = new IOST.RPC(new IOST.HTTPProvider("http://54.180.196.80:30001"));
      rpc.blockchain.getChainInfo().then(console.log);

      // init iost sdk
      this.myIOST = new IOST.IOST({ // will use default setting if not set
        gasRatio: 1,
        gasLimit: 2000000,
        delay:0,
      }, new IOST.HTTPProvider('http://54.180.196.80:30001'));

      this.myIOST.setAccount('token.iost');

      this.myIOST.rpc = rpc;
      this.myIOST.setRPC(rpc);

      return false;
    }
  }

  decodeB58(string) {
    var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var ALPHABET_MAP = {};
    var BASE = 58;
    for (var i = 0; i < ALPHABET.length; i++) {
      ALPHABET_MAP[ALPHABET.charAt(i)] = i;
    }

    if (string.length === 0) return [];
    var i: number, j: number;
    var bytes = [0];

    for (i = 0; i < string.length; i++) {
      var c = string[i];
          // c是不是ALPHABET_MAP的key 
      if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
      for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
      bytes[0] += ALPHABET_MAP[c];
      var carry = 0;
      for (j = 0; j < bytes.length; ++j) {
        bytes[j] += carry;
        carry = bytes[j] >> 8;
              // 0xff --> 11111111
        bytes[j] &= 0xff;
      }
      while (carry) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }

    // deal with leading zeros
    for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0);

    return new Uint8Array(bytes.reverse());
  }

  getUserAddress(): string {
    return this.myAddress;
  }

  isMe(address: string) : boolean {
    return address == this.myAddress;
  }

  startGame(channel, referrer) {
    this.myIOST.config.gasLimit = 1000000;
    const tx = this.myIOST.callABI(environment.account,
                                   'startGame',
                                   [channel, referrer]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  startTrial(option): Promise<Array<number>> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.account,
                                   'startTrial',
                                   [option.toString()]);
    tx.addApprove('iost', 100);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  setDefenseUnitIdArray(unitIdArray: Array<number>) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'setDefenseUnitIdArray',
                                   [JSON.stringify(unitIdArray)]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  upgrade(unitId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'upgrade',
                                   [unitId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  unlockLevel(unitId: number, level: number): Promise<Array<number>> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'unlockLevel',
                                   [unitId.toString(),
                                    level.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  recover(unitId: number, cost: number): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'recover',
                                   [unitId.toString()]);
    tx.addApprove('iost', cost + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  recoverInBatch(unitIdArray: Array<number>, totalCost: number): Promise<any> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'recoverInBatch',
                                   [JSON.stringify(unitIdArray)]);
    tx.addApprove('iost', totalCost + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result)
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        console.log(result)
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  recycleItem(itemRId): Promise<number> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'recycleItem',
                                   [itemRId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  recycleInBatch(itemRIdArray): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'recycleInBatch',
                                   [JSON.stringify(itemRIdArray)]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  mountItem(itemRId, unitId) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'mountItem',
                                   [itemRId.toString(),
                                    unitId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  unmountItem(itemRId) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'unmountItem',
                                   [itemRId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  synthesize(itemRIdArray, createdItemId) {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'synthesize',
                                   [JSON.stringify(itemRIdArray),
                                    createdItemId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  upgradeItem(rIdA: number, rIdB: number): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(
        environment.itemManager, 'upgrade', [rIdA.toString(), rIdB.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  clearCooldown(rId: number): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(
        environment.itemManager, 'clearCooldown', [rId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  battleWithStage(unitIdArray: Array<number>,
                  stageId: number,
                  placeIndex: number,
                  battleIndex: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'battleWithStage',
                                   [JSON.stringify(unitIdArray),
                                    stageId.toString(),
                                    placeIndex.toString(),
                                    battleIndex.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result);
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  battleWithStageBatch(unitIdArray: Array<number>,
                       stageId: number,
                       placeIndex: number,
                       battleIndex: number) {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'battleWithStageBatch',
                                   [JSON.stringify(unitIdArray),
                                    stageId.toString(),
                                    placeIndex.toString(),
                                    battleIndex.toString()]);
    tx.addApprove('iost', 3);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result);
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  battleWithPeer(unitIdArray: Array<number>, peer: string, isPaid: boolean) {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'battleWithPeer',
                                   [JSON.stringify(unitIdArray),
                                    peer,
                                    isPaid ? '1': '0']);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  payForAttack() {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'payForAttack',
                                   []);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyUnitFromPlatform(unitId: number, price: number): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'buyFromPlatform',
                                   [unitId.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  sellUnitOffer(unitId, price) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'sell',
                                   [unitId.toString(),
                                    price.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  cancelUnitOffer(unitId) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'cancel',
                                   [unitId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyUnitOffer(page: number, rId: number, price: number): Promise<number> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.unitManager,
                                   'buy',
                                   [page.toString(),
                                    rId.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  sellItemOffer(rId, price) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'sell',
                                   [rId.toString(),
                                    price.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve("");
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  sellItemInBatch(itemRIdArray, price): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'sellInBatch',
                                   [JSON.stringify(itemRIdArray), price.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  cancelItemOffer(rId) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'cancel',
                                   [rId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyItemOffer(page, rId, price): Promise<number> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'buy',
                                   [page.toString(),
                                    rId.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyItemInBatch(itemId, price, amount): Promise<Array<number>> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.itemManager,
                                   'buyInBatch',
                                   [itemId.toString(),
                                    price.toString(),
                                    amount.toString()]);
    tx.addApprove('iost', price * amount + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  burnForDividend(amount): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.treasureManager, 'burn', [
        amount.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve();
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  drawUnit(unitId: number, amount: number): Promise<number> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.lotteryManager, 'drawUnit', [
        unitId.toString(), amount.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyUnitWithBadLuck(unitId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.lotteryManager, 'buyUnitWithBadLuck', [
        unitId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyItemWithBadLuck(itemId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.lotteryManager, 'buyItemWithBadLuck', [
        itemId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  withdraw(): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.treasureManager, 'withdraw', []);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  withdrawReferralBonus(): Promise<any> {
    this.myIOST.config.gasLimit = 1000000;
    const tx = this.myIOST.callABI(environment.treasureManager, 'withdrawReferralBonus', []);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  queueForBattle(times: number, price: number): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.epicManager, 'queueForBattle', [times.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  queueForTournament(unitIdArray: number[]): Promise<any> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.tournamentManager, 'queueForTournament', [JSON.stringify(unitIdArray)]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyCity(cityId, amount, price): Promise<Array<number>> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'buyCity',
                                   [cityId.toString(),
                                    amount.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  setUnitIdArrayOnLand(landId, unitIdArray): Promise<Array<number>> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'setUnitIdArray',
                                   [landId.toString(),
                                    JSON.stringify(unitIdArray)]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  rentTo(landId: number, price: number, duration: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'rentTo',
                                   [landId.toString(),
                                    price.toString(),
                                    duration.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  rentCancel(landId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'rentCancel',
                                   [landId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  rentFrom(landId: number, price: number): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'rentFrom',
                                   [landId.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  sellLand(landId: number, price: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'sellLand',
                                   [landId.toString(),
                                    price.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  sellCancel(landId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'sellCancel',
                                   [landId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  buyLand(landId: number, price: number): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'buyLand',
                                   [landId.toString()]);
    tx.addApprove('iost', price + 0.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  oath(landId: number) {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'oath',
                                   [landId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  reactivate(landId: number): Promise<Array<any>> {
    this.myIOST.config.gasLimit = 2000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'reactivate',
                                   [landId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  changeCity(landId: number, cityId: number) {
    this.myIOST.config.gasLimit = 1000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'changeCity',
                                   [landId.toString(),
                                    cityId.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  attackCity(unitIdArray: Array<number>, cityId: number): Promise<any> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'battleWithLand',
                                   [JSON.stringify(unitIdArray),
                                    cityId.toString(),
                                    '0',
                                    '0']);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result);
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  attackLand(unitIdArray: Array<number>, landId: number, isPaid: boolean): Promise<any> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.battle,
                                   'battleWithLand',
                                   [JSON.stringify(unitIdArray),
                                    '0',
                                    landId.toString(),
                                    isPaid ? '1' : '0']);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result);
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  setCityTax(cityId: number, taxRate: number) {
    this.myIOST.config.gasLimit = 1000000;
    const tx = this.myIOST.callABI(environment.landManager,
                                   'setCityTax',
                                   [cityId.toString(),
                                    taxRate.toString()]);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        console.log(result);
        resolve('');
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  drawWithTicket(): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.lotteryManager,
                                   'drawWithTicket',
                                   []);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }

  drawWithIOST(): Promise<number> {
    this.myIOST.config.gasLimit = 4000000;
    const tx = this.myIOST.callABI(environment.lotteryManager,
                                   'drawWithIOST',
                                   []);
    tx.addApprove('iost', 500.01);
    return new Promise((resolve, reject) => {
      this.myIOST.signAndSend(tx).on('success', result => {
        resolve(JSON.parse(JSON.parse(result.returns[0])[0]));
      }).on('failed', result => {
        if (typeof result == "object" && result.message) {
          result = result.message;
        }
        reject(result);
      });
    });
  }
}
