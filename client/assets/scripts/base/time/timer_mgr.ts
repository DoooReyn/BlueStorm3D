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
        let timerHookNode = new Node("Root#Timer");
        director.addPersistRootNode(timerHookNode);
        this._hook = timerHookNode.addComponent(TimerHook);
        this._hook.onPause = this.pauseAllTimers.bind(this);
        this._hook.onResume = this.resumeAllTimers.bind(this);
    }

    protected onDestroy(): void {
        this.delAllTimers();
        this._hook.unscheduleAllCallbacks();
        director.removePersistRootNode(this._hook.node);
        this._hook = null;
    }

    /**
     * 获得指定tag的定时器
     * @param tag 定时器tag
     * @returns
     */
    public getTimer(tag: string): Timer | null | undefined {
        return this._timers.find((v) => v.tag === tag);
    }

    /**
     * 创建定时器
     * @param info 定时器信息
     * @param autoStart 是否自动启动
     * @returns
     */
    public createTimer(info: T_TimerInfo, autoStart: boolean = true) {
        const timer = new Timer(info);
        this._timers.push(timer);
        autoStart && timer.start();
        return timer.tag;
    }

    /**
     * 启动定时器
     * @param tag 定时器tag
     */
    public startTimer(tag: string) {
        const timer = this.getTimer(tag);
        timer && timer.start();
    }

    /**
     * 暂停定时器
     * @param tag 定时器tag
     */
    public pauseTimer(tag: string) {
        const timer = this.getTimer(tag);
        timer && timer.pause();
    }

    /**
     * 恢复定时器
     * @param tag 定时器tag
     */
    public resumeTimer(tag: string) {
        const timer = this.getTimer(tag);
        timer && timer.resume();
    }

    /**
     * 停止定时器
     * @param tag 定时器tag
     */
    public stopTimer(tag: string) {
        const timer = this.getTimer(tag);
        timer && timer.stop();
    }

    /**
     * 重置定时器
     * @param tag 定时器tag
     */
    public resetTimer(tag: string) {
        const timer = this.getTimer(tag);
        timer && timer.reset();
    }

    /**
     * 重开定时器
     * @param tag 定时器tag
     * @param force 是否强制重开
     */
    public restartTimer(tag: string, force: boolean = false) {
        const timer = this.getTimer(tag);
        timer && timer.restart(force);
    }

    /**
     * 定时器是否正在运行
     * @param tag 定时器tag
     * @returns
     */
    public isTimerTicking(tag: string) {
        const timer = this.getTimer(tag);
        if (timer) {
            return timer.ticking;
        }
        return false;
    }

    /**
     * 定时器是否暂停中
     * @param tag 定时器tag
     * @returns
     */
    public isTimerPaused(tag: string) {
        const timer = this.getTimer(tag);
        if (timer) {
            return timer.paused;
        }
        return false;
    }

    /**
     * 定时器是否已停止
     * @param tag 定时器tag
     * @returns
     */
    public isTimerStopped(tag: string) {
        const timer = this.getTimer(tag);
        if (timer) {
            return timer.stopped;
        }
        return false;
    }

    /**
     * 删除定时器
     * @param objOrTag 定时器
     */
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

    /**
     * 暂停所有定时器
     * // WARN 你需要明白要做什么，建议手动管理
     */
    public pauseAllTimers() {}

    /**
     * 恢复所有定时器
     * // WARN 你需要明白要做什么，建议手动管理
     */
    public resumeAllTimers() {}

    /**
     * 停止使用定时器
     */
    public stopAllTimers() {
        this._timers.forEach((v) => {
            v.stop();
        });
    }

    /**
     * 删除所有定时器
     */
    public delAllTimers() {
        for (const timer of this._timers) {
            timer.stop();
        }
        this._timers.length = 0;
    }

    /**
     * @zh
     * 延迟调用
     * @param cb 回调
     * @param delay 延迟时间
     */
    public delayDo(cb: Function, delay?: number) {
        Timer.delayDo(cb, delay);
    }

    /**
     * @zh
     * 循环调用
     * @param info 定时器基础信息
     */
    public loopDo(info: T_TimerInfo) {
        return Timer.loopDo(info);
    }
}
