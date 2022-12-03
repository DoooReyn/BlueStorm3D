import { director, Node } from "cc";
import { isString } from "../func/types";
import SingletonBase from "../singleton_base";
import { Timer, T_TimerInfo } from "./timer";
import TimerHook from "./timer_hook";

/**
 * 定时器管理器
 */
export class TimerMgr extends SingletonBase {
    private _hook: TimerHook = null;
    private _timers: Timer[] = [];

    public get hook() {
        return this._hook;
    }

    protected onInitialize(): void {
        let timerHookNode = new Node();
        director.addPersistRootNode(timerHookNode);
        this._hook = timerHookNode.addComponent(TimerHook);
    }

    protected onDestroy(): void {
        this.delAllTimers();
        this._hook.unscheduleAllCallbacks();
        director.removePersistRootNode(this._hook.node);
        this._hook = null;
    }

    public getTimer(tag: string) {
        return this._timers.find((v) => v.tag === tag);
    }

    public addTimer(timer: Timer) {
        if (this._timers.indexOf(timer) === -1) this._timers.push(timer);
    }

    public newTimer(info: T_TimerInfo) {
        return new Timer(info);
    }

    public delTimer(objOrTag: Timer | string) {
        let index = -1;
        if (objOrTag instanceof Timer) {
            index = this._timers.indexOf(objOrTag);
        } else if (isString(objOrTag)) {
            index = this._timers.findIndex((v) => v.tag === objOrTag);
        }
        if (index > -1) {
            const timers = this._timers.splice(index, 1);
            timers[0].stop();
        }
    }

    public delAllTimers() {
        for (const timer of this._timers) {
            timer.stop();
        }
        this._timers.length = 0;
    }
}
