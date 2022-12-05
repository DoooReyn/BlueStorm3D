import { _decorator, Component, game, Game } from "cc";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/time/timer_hook.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 21:49:58 GMT+0800 (中国标准时间)
 * Desc     : 定时器执行组件
 */
@ccclass("TimerHook")
export default class TimerHook extends Component {
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
