import { environment } from '../environments/environment';

import { UnitManager } from './unit-manager';


export class StageManager {

  _iost: any = null;

  constructor(iost: any) {
    this._iost = iost;
  }

  async _getStage(stageId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.stageManager, "stage", stageId.toString(), true);
    return JSON.parse(obj.data) || [];
  }

  async _getDependency(stageId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.stageManager, "dependency", stageId.toString(), true);
    return JSON.parse(obj.data) || {};
  }

  async hasFinished(user, stageId) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.stageManager, "progress_" + stageId.toString(), user, true);
    const value = JSON.parse(obj.data);

    return value ? value.finished : 0;
  }

  async getProgress(stageId: number) {
    const obj = await this._iost.rpc.blockchain.getContractStorage(
        environment.stageManager, "progress_" + stageId.toString(), this._iost.currentAccount, true);
    return JSON.parse(obj.data) || {placeIndex: 0, battleIndex: 0};
  }

  async getStage(unitManager: UnitManager, stageId: number) {
    var clearOnDependency = true;

    const dependency = await this._getDependency(stageId);
    if (dependency.stageId) {
      const finished = await this.hasFinished(this._iost.currentAccount, dependency.stageId);

      if (!finished) {
        clearOnDependency = false;
      }
    }

    const stage = await this._getStage(stageId);
    const progress = await this.getProgress(stageId);

    for (let placeIndex = 0; placeIndex < stage.length; ++placeIndex) {
      for (let battleIndex = 0; battleIndex < stage[placeIndex].length; ++battleIndex) {
        if (clearOnDependency &&
            (placeIndex < progress.placeIndex ||
             (placeIndex == progress.placeIndex && battleIndex <= progress.battleIndex))) {
          stage[placeIndex][battleIndex].available = 1;

          if (placeIndex == progress.placeIndex && battleIndex == progress.battleIndex) {
            stage[placeIndex][battleIndex].finished = 0;
          } else {
            stage[placeIndex][battleIndex].finished = 1;
          }
        } else {
          stage[placeIndex][battleIndex].available = 0;
        }

        for (let i = 0; i < stage[placeIndex][battleIndex].units.length; ++i) {
          unitManager.getHp(stage[placeIndex][battleIndex].units[i].unitId,
                            stage[placeIndex][battleIndex].units[i].level).then(hp => {
            stage[placeIndex][battleIndex].units[i].hp = hp;
          });
        }
      }
    }

    return stage;
  }

  async refreshStageByProgress(stageId: number, stage: any) {
    var clearOnDependency = true;

    const dependency = await this._getDependency(stageId);
    if (dependency.stageId) {
      const finished = await this.hasFinished(this._iost.currentAccount, dependency.stageId);

      if (!finished) {
        clearOnDependency = false;
      }
    }

    const progress = await this.getProgress(stageId);
    for (let placeIndex = 0; placeIndex < stage.length; ++placeIndex) {
      for (let battleIndex = 0; battleIndex < stage[placeIndex].length; ++battleIndex) {
        if (clearOnDependency &&
            (placeIndex < progress.placeIndex ||
             (placeIndex == progress.placeIndex && battleIndex <= progress.battleIndex))) {
          stage[placeIndex][battleIndex].available = 1;

          if (placeIndex == progress.placeIndex && battleIndex == progress.battleIndex) {
            stage[placeIndex][battleIndex].finished = 0;
          } else {
            stage[placeIndex][battleIndex].finished = 1;
          }
        } else {
          stage[placeIndex][battleIndex].available = 0;
        }
      }
    }
  }
};
