import { _decorator, Component, Node, Button, Label, EventTouch } from "cc";
import { Singletons } from "../../base/singletons";
import { Timer } from "../../base/time/timer";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/timer/timer_scene.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 22:09:16 GMT+0800 (中国标准时间)
 * Class    : TimerScene
 * Desc     :
 */
@ccclass("TimerScene")
export class TimerScene extends Component {
    @property(Button)
    delayBtn: Button = null;
    @property(Button)
    startBtn: Button = null;
    @property(Button)
    pauseBtn: Button = null;
    @property(Button)
    stopBtn: Button = null;
    @property(Button)
    restartBtn: Button = null;
    @property(Label)
    delayLab: Label = null;
    @property(Label)
    pauseLab: Label = null;
    @property(Label)
    loopLab: Label = null;

    private _delayTimer: string = null;
    private _loopTimer: string = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        const self = this;
        this._delayTimer = Singletons.timer.createTimer(
            {
                interval: 1,
                ticks: 3,
                onStart(ref) {
                    self.delayBtn.interactable = false;
                    self.delayLab.string = `${ref.ticks - ref.current}秒后可用`;
                },
                onTick(ref: Timer) {
                    self.delayLab.string = `${ref.ticks - ref.current}秒后可用`;
                },
                onStop() {
                    self.delayBtn.interactable = true;
                    self.delayLab.string = "开始";
                },
            },
            false
        );

        this.startBtn.interactable = true;
        this.pauseBtn.interactable = false;
        this.stopBtn.interactable = false;
        this.restartBtn.interactable = false;
        this._loopTimer = Singletons.timer.createTimer(
            {
                interval: 1,
                onStart(ref) {
                    self.startBtn.interactable = false;
                    self.pauseBtn.interactable = true;
                    self.stopBtn.interactable = true;
                    self.restartBtn.interactable = true;
                    self.pauseLab.string = "暂停";
                    self.loopLab.string = `${ref.current}`;
                },
                onTick(ref) {
                    self.loopLab.string = `${ref.current}`;
                },
                onPause() {
                    self.startBtn.interactable = false;
                    self.pauseBtn.interactable = true;
                    self.pauseLab.string = "恢复";
                    self.stopBtn.interactable = true;
                    self.restartBtn.interactable = true;
                },
                onResume() {
                    self.startBtn.interactable = false;
                    self.pauseBtn.interactable = true;
                    self.pauseLab.string = "暂停";
                    self.stopBtn.interactable = true;
                    self.restartBtn.interactable = true;
                },
                onStop() {
                    self.startBtn.interactable = false;
                    self.pauseBtn.interactable = false;
                    self.stopBtn.interactable = false;
                    self.restartBtn.interactable = true;
                    self.pauseLab.string = "暂停";
                },
            },
            false
        );
    }

    onBtnClicked(e: EventTouch, type: string) {
        switch (type) {
            case "DelayStart":
                Singletons.timer.startTimer(this._delayTimer);
                break;
            case "LoopStart":
                Singletons.timer.startTimer(this._loopTimer);
                break;
            case "LoopPause":
                if (Singletons.timer.isTimerPaused(this._loopTimer)) {
                    Singletons.timer.resumeTimer(this._loopTimer);
                } else if (Singletons.timer.isTimerTicking(this._loopTimer)) {
                    Singletons.timer.pauseTimer(this._loopTimer);
                }
                break;
            case "LoopStop":
                Singletons.timer.stopTimer(this._loopTimer);
                break;
            case "LoopRestart":
                Singletons.timer.restartTimer(this._loopTimer, true);
                break;
        }
    }
}
