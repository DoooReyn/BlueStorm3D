import { _decorator, game, Game } from "cc";
import { Gossip } from "../ui/add_ons/gossip";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/time/timer_hook.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 21:49:58 GMT+0800 (中国标准时间)
 * Desc     : 定时器执行组件
 */
@ccclass("timer_hook")
export default class TimerHook extends Gossip {
    onPause: Function = null;
    onResume: Function = null;

    onEnable() {
        game.on(Game.EVENT_HIDE, this.pause, this);
        game.on(Game.EVENT_SHOW, this.resume, this);
    }

    onDisable() {
        game.off(Game.EVENT_HIDE, this.pause, this);
        game.off(Game.EVENT_SHOW, this.resume, this);
    }

    pause() {
        this?.onPause();
    }

    resume() {
        this?.onResume();
    }
}
