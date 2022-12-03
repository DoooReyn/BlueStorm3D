import { _decorator, Component, Node, director } from "cc";
import SingletonBase from "../singleton_base";
const { ccclass } = _decorator;
/**
 * Url      : db://assets/scripts/base/time/timer_hook.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 21:49:58 GMT+0800 (中国标准时间)
 * Desc     : 定时器执行组件
 */
@ccclass("TimerHook")
export default class TimerHook extends Component {}

/**
 * 定时器管理器
 */
export class TimerMgr extends SingletonBase {
    private _hook: TimerHook = null;

    public get hook() {
        return this._hook;
    }

    protected onInitialize(): void {
        let timerHookNode = new Node();
        director.addPersistRootNode(timerHookNode);
        this._hook = timerHookNode.addComponent(TimerHook);
    }

    protected onDestroy(): void {
        this._hook.unscheduleAllCallbacks();
        director.removePersistRootNode(this._hook.node);
        this._hook = null;
    }
}
