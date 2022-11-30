import { EventBus } from "./event/event_bus";
import { Log } from "./log/log";
import { DataStore } from "./store/data_store";

/**
 * Url      : db://assets/scripts/base/singletons.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:28:08 GMT+0800 (中国标准时间)
 * Desc     : 单例类挂载节点
 */

export class Singletons {
    // ---------------------------------- 日志 ----------------------------------
    private static _log: Log = null;
    public static get log() {
        return (this._log = this._log || new Log());
    }

    // ---------------------------------- 存储 ----------------------------------
    private static _store: DataStore = null;
    public static get store() {
        return (this._store = this._store || new DataStore());
    }

    // ---------------------------------- 事件 ----------------------------------
    private static _event: EventBus = null;
    public static get event() {
        return (this._event = this._event || new EventBus());
    }

    // ---------------------------------- 销毁 ----------------------------------
    public static destoryAll() {
        this._log.close();
        delete this._log;
    }
}

(window as any).Singletons = Singletons;
