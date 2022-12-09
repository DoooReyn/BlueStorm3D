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

    /**
     * 长按是否生效
     */
    private _isLongPressed: boolean = false;

    private _audio: AudioInfo = AudioMap.click;

    // REGION ENDED <Member Variables>

    // REGION START <private>

    /**
     * 开始长按等待计时
     */
    private _startLongPressCounter() {
        this.schedule(this._onLongPressCounterReached, this.longPressWaitTime);
    }

    /**
     * 停止长按等待计时
     */
    private _stopLongPressCounter() {
        this.unschedule(this._onLongPressCounterReached);
    }

    /**
     * 开始长按触发计时
     */
    private _startLongPressTriggeredCounter() {
        this.schedule(this._onLongPressCounterTriggered, this.longPressTriggerInterval, macro.REPEAT_FOREVER);
    }

    /**
     * 停止长按触发计时
     */
    private _stopLongPressTriggeredCounter() {
        this.unschedule(this._onLongPressCounterTriggered);
        if (this._isLongPressed) {
            this._isLongPressed = false;
            this.setClickedOnceEnabled(true);
            this.node.emit(E_UiButtonEvent.LONG_PRESS_ENDED, this);
        }
    }

    /**
     * 长按等待计时触发回调
     */
    private _onLongPressCounterReached() {
        this._stopLongPressCounter();
        this._startLongPressTriggeredCounter();
        this._isLongPressed = true;
        this.setClickedOnceEnabled(false);
        this.node.emit(E_UiButtonEvent.LONG_PRESS_STARTED, this);
    }

    /**
     * 长按触发计时触发回调
     */
    private _onLongPressCounterTriggered() {
        this.playAudio();
        this.node.emit(E_UiButtonEvent.LONG_PRESS_TRIGGERED, this);
        this.longPressTriggerEvents.forEach((v) => v.emit([this]));
    }

    // REGION ENDED <private>

    // REGION START <protected>

    /**
     * 按钮状态切换回调
     */
    protected onStateChanged(state: E_UiButtonState) {
        if (this.longPressEnabled) {
            if (state === E_UiButtonState.PRESSED) {
                this._startLongPressCounter();
            } else if (state !== E_UiButtonState.HOVER) {
                this._stopLongPressCounter();
                this._stopLongPressTriggeredCounter();
            }
        }
    }

    /**
     * 单次点击回调
     * @param _
     */
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

    /**
     * 播放音频
     * @param audio 音频信息
     */
    public playAudio(audio?: AudioInfo) {
        audio && this.setAudioInfo(audio);
        this.audioEnabled && Singletons.audio.play(this._audio);
    }

    /**
     * 设置音频信息
     * @param audio 音频信息
     */
    public setAudioInfo(audio: AudioInfo) {
        this._audio = audio;
    }

    /**
     * 开启/关闭状态切换监听
     * @param e 开启
     */
    public setStateChangedEnabled(e: boolean) {
        e
            ? this.node.on(E_UiButtonEvent.STATE_CHANGED, this.onStateChanged, this)
            : this.node.off(E_UiButtonEvent.STATE_CHANGED, this.onStateChanged, this);
    }

    /**
     * 开启/关闭单次点击监听
     * @param e 开启
     */
    public setClickedOnceEnabled(e: boolean) {
        e
            ? this.node.on(E_UiButtonEvent.CLICK, this.onClickedOnce, this)
            : this.node.off(E_UiButtonEvent.CLICK, this.onClickedOnce, this);
    }

    // REGION ENDED <public>
}
