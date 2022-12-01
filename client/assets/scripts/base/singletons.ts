import { director, Node } from "cc";
import { EventBus } from "./event/event_bus";
import { Log } from "./log/log";
import { RedDotMgr } from "./red/red_dot_mgr";
import { DataStore } from "./store/data_store";
import TimerHook from "./time/timer_hook";

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

    // ---------------------------------- 红点 ----------------------------------
    private static _red: RedDotMgr = null;
    public static get red() {
        return (this._red = this._red || new RedDotMgr());
    }

    // ------------------------------ 定时器HOOK组件 -----------------------------
    private static _timerHook: TimerHook = null;
    public static get timerHook() {
        if (!this._timerHook) {
            let timerHookNode = new Node();
            let timerHookCom = timerHookNode.addComponent(TimerHook);
            director.addPersistRootNode(timerHookNode);
            this._timerHook = timerHookCom;
        }
        return this._timerHook;
    }

    // ---------------------------------- 销毁 ----------------------------------
    public static destoryAll() {
        if (this._log) {
            this._log.close();
            delete this._log;
        }

        if (this._timerHook) {
            this._timerHook.unscheduleAllCallbacks();
            director.removePersistRootNode(this._timerHook.node);
            delete this._timerHook;
        }
    }
}

(window as any).Singletons = Singletons;
