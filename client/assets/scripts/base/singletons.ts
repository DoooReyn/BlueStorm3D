/**
 * Url      : db://assets/scripts/base/singletons.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:28:08 GMT+0800 (中国标准时间)
 * Desc     : 单例类挂载节点
 */

import { Log } from "./log/log";

export class Singletons {
  // ----------------- 日志 -----------------
  private static _log: Log = null;
  public static get log() {
    return (this._log = this._log || new Log());
  }
  public static destoryAll() {
    this._log.close();
    delete this._log;
  }
}
