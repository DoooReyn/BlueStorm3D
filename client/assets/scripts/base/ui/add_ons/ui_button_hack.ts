import { Button } from "cc";

/**
 * Url      : db://assets/scripts/base/ui/ui_button_hack.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 15:33:08 GMT+0800 (中国标准时间)
 * Class    : UiHackableButton
 * Desc     : 让 Button 拥有 Hack 能力
 *  - 通过节点监听 HackableButtonEventType.STATE_CHANGED 事件，可以跟踪按钮的状态变化
 */
export class UiHackableButton {
    private static _hacked: boolean = false;
    public static hack() {
        if (!this._hacked) {
            this._hacked = true;
            // @ts-ignore
            let raw = Button.prototype._applyTransition;
            // @ts-ignore
            Button.prototype._applyTransition = function (state: string) {
                raw.call(this, state);
                this.node.emit(E_UiButtonEvent.STATE_CHANGED, state, this);
            };
        }
    }
}

/**
 * UIHackButton 支持的事件
 */
export enum E_UiButtonEvent {
    CLICK = "click",
    STATE_CHANGED = "state-changed",
    LONG_PRESS_STARTED = "long-press-started",
    LONG_PRESS_TRIGGERED = "long-press-triggered",
    LONG_PRESS_ENDED = "long-press-ended",
}

export enum E_UiButtonState {
    NORMAL = "normal",
    HOVER = "hover",
    PRESSED = "pressed",
    DISABLED = "disabled",
}
