import { AudioMgr } from "./audio/audio_mgr";
import { EventBus } from "./event/event_bus";
import { i18nMgr } from "./i18n/i18n_mgr";
import { Log } from "./log/log";
import { RedDotMgr } from "./red/red_dot_mgr";
import { DynamicResMgr } from "./res/dynamic_res_mgr";
import { DataStore } from "./store/data_store";
import { TimerMgr } from "./time/timer_mgr";

/**
 * Url      : db://assets/scripts/base/singletons.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:28:08 GMT+0800 (中国标准时间)
 * Class    : Singletons
 * Desc     : 单例类挂载节点
 */
export class Singletons {
    // ---------------------------------- 日志 ----------------------------------
    private static _log: Log = null;
    public static get log() {
        return (this._log = Log.getInstance());
    }

    // ---------------------------------- 存储 ----------------------------------
    private static _store: DataStore = null;
    public static get store() {
        return (this._store = DataStore.getInstance());
    }

    // ---------------------------------- 事件 ----------------------------------
    private static _event: EventBus = null;
    public static get event() {
        return (this._event = EventBus.getInstance());
    }

    // ---------------------------------- 红点 ----------------------------------
    private static _red: RedDotMgr = null;
    public static get red() {
        return (this._red = RedDotMgr.getInstance());
    }

    // ------------------------------- 定时器HOOK组件 ------------------------------
    private static _timer: TimerMgr = null;
    public static get timer() {
        return (this._timer = TimerMgr.getInstance());
    }

    // ---------------------------------- 语言 ----------------------------------
    private static _i18n: i18nMgr = null;
    public static get i18n() {
        return (this._i18n = i18nMgr.getInstance("BlueStorm3#language"));
    }

    // ------------------------------- 动态资源管理器 --------------------------------
    private static _drm: DynamicResMgr = null;
    public static get drm() {
        return (this._drm = DynamicResMgr.getInstance());
    }

    // ---------------------------------- 音频 ----------------------------------
    private static _audio: AudioMgr = null;
    public static get audio() {
        return (this._audio = AudioMgr.getInstance(true));
    }

    // ---------------------------------- 销毁 ----------------------------------
    public static destoryAll() {
        if (this._log) {
            this._log.destroy();
            delete this._log;
        }

        if (this._store) {
            this._store.destroy();
            delete this._store;
        }

        if (this._event) {
            this._event.destroy();
            delete this._event;
        }

        if (this._red) {
            this._red.destroy();
            delete this._red;
        }

        if (this._timer) {
            this._timer.destroy();
            delete this._timer;
        }

        if (this._i18n) {
            this._i18n.destroy();
            delete this._i18n;
        }

        if (this._drm) {
            this._drm.destroy();
            delete this._drm;
        }

        if (this._audio) {
            this._audio.destroy();
            delete this._audio;
        }
    }
}

(window as any).Singletons = Singletons;
