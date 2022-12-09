import { _decorator, Button, macro, EventHandler } from "cc";
import { AudioMap } from "../../audio/audio_map";
import { AudioInfo, I_AudioInfo } from "../../res/res_info";
import { Singletons } from "../../singletons";
import { E_UiButtonEvent, E_UiButtonState, UiHackableButton } from "./ui_button_hack";
const { ccclass, property, disallowMultiple, menu, executeInEditMode } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/ui_cmm_button.ts
 * Author   : reyn
 * Date     : Fri Dec 09 2022 22:34:48 GMT+0800 (中国标准时间)
 * Class    : UiCmmButton
 * Desc     : 通用按钮
 */
@ccclass("ui_cmm_button")
@menu("BlueStorm/ui_cmm_button")
@disallowMultiple(true)
@executeInEditMode(false)
export class UiCmmButton extends Button {
    // REGION START <Member Variables>
    @property({ displayName: "播放按钮音效" })
    audioEnabled = true;

    @property({ displayName: "是否阻止快速点击" })
    preventQuickClickEnabled = false;

    @property({ displayName: "阻止快速点击时间间隔" })
    preventQuickClickInterval: number = 1;

    @property({ displayName: "是否支持长按触发" })
    longPressEnabled: boolean = false;

    @property({ displayName: "长按触发等待事件" })
    longPressWaitTime: number = 1.0;

    @property({ displayName: "长按触发时间间隔" })
    longPressTriggerInterval: number = 0.1;

    @property({ displayName: "长按触发事件回调", type: [EventHandler] })
    longPressTriggerEvents: EventHandler[] = [];

    private _isLongPressed: boolean = false;

    // REGION ENDED <Member Variables>

    // REGION START <private>

    private _startLongPressCounter() {
        this.schedule(this._onLongPressCounterReached, this.longPressWaitTime);
    }

    private _stopLongPressCounter() {
        this.unschedule(this._onLongPressCounterReached);
    }

    private _startLongPressTriggeredCounter() {
        this.schedule(this._onLongPressCounterTriggered, this.longPressTriggerInterval, macro.REPEAT_FOREVER);
    }

    private _stopLongPressTriggeredCounter() {
        this.unschedule(this._onLongPressCounterTriggered);
        if (this._isLongPressed) {
            this._isLongPressed = false;
            this.setClickedOnceEnabled(true);
            this.node.emit(E_UiButtonEvent.LONG_PRESS_ENDED, this);
        }
    }

    private _onLongPressCounterReached() {
        this._stopLongPressCounter();
        this._startLongPressTriggeredCounter();
        this._isLongPressed = true;
        this.setClickedOnceEnabled(false);
        this.node.emit(E_UiButtonEvent.LONG_PRESS_STARTED, this);
    }

    private _onLongPressCounterTriggered() {
        this.playAudio();
        this.node.emit(E_UiButtonEvent.LONG_PRESS_TRIGGERED, this);
        this.longPressTriggerEvents.forEach((v) => v.emit([this]));
    }

    // REGION ENDED <private>

    // REGION START <protected>

    protected onStateChanged(state: E_UiButtonState) {
        if (this.longPressEnabled) {
            if (state === E_UiButtonState.PRESSED) {
                this._startLongPressCounter();
            } else {
                this._stopLongPressCounter();
                this._stopLongPressTriggeredCounter();
            }
        }
    }

    protected onClickedOnce(_: Button) {
        if (this.preventQuickClickEnabled) {
            this.interactable = false;
            this.scheduleOnce(() => {
                this.interactable = true;
            }, this.preventQuickClickInterval);
        }
        this.playAudio();
    }

    // REGION ENDED <protected>

    // REGION START <public>

    public onLoad() {
        UiHackableButton.hack();
    }

    public onEnable() {
        super.onEnable();
        this.setStateChangedEnabled(true);
        this.setClickedOnceEnabled(true);
    }

    public onDisable() {
        super.onDisable();
        this.setStateChangedEnabled(false);
        this.setClickedOnceEnabled(false);
    }

    public playAudio(audio?: AudioInfo) {
        this.audioEnabled && Singletons.audio.play(audio || AudioMap.click);
    }

    public setStateChangedEnabled(e: boolean) {
        e
            ? this.node.on(E_UiButtonEvent.STATE_CHANGED, this.onStateChanged, this)
            : this.node.off(E_UiButtonEvent.STATE_CHANGED, this.onStateChanged, this);
    }

    public setClickedOnceEnabled(e: boolean) {
        e
            ? this.node.on(E_UiButtonEvent.CLICK, this.onClickedOnce, this)
            : this.node.off(E_UiButtonEvent.CLICK, this.onClickedOnce, this);
    }

    // REGION ENDED <public>
}
