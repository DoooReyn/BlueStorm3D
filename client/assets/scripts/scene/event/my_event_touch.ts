import { _decorator, Component, NodeEventType, Event, UITransform, EventTouch, Sprite, Color } from "cc";
import { Singletons } from "../../base/singletons";
import { Gossip } from "../../base/ui/add_ons/gossip";
const { ccclass } = _decorator;

class MyEvent extends Event {
    // 自定义的属性
    public detail: any = null;

    constructor(name: string, bubbles?: boolean, detail?: any) {
        super(name, bubbles);
        this.detail = detail;
    }
}

/**
 * Url      : db://assets/scripts/scene/event/event_touch.ts
 * Author   : reyn
 * Date     : Wed Nov 30 2022 14:23:35 GMT+0800 (中国标准时间)
 * Class    : EventTouch
 * Desc     : 触摸事件测试
 */

enum E_TouchType {
    SwallowForbidden = 0,
    SwallowAllowedButRectLimited,
    SwallowAllowedWithoutRectLimited,
}

@ccclass("MyEventTouch")
export class MyEventTouch extends Gossip {
    private _touchType: E_TouchType = E_TouchType.SwallowForbidden;
    private _color: Color = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        this._color = this.node.getComponent(Sprite).color.clone();
    }

    onDestroy() {}

    onEnable() {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchedStart, this);
        this.node.on(NodeEventType.TOUCH_END, this._onTouched, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouched, this);
        this.node.on("clicked", this._onClicked, this);
    }

    onDisable() {
        this.node.off(NodeEventType.TOUCH_END, this._onTouched, this);
        this.node.off("clicked", this._onClicked, this);
    }

    public setTouchEventType(t: E_TouchType) {
        this._touchType = t;
    }

    private _onTouchedStart(e: EventTouch) {
        const transform = this.node.getComponent(UITransform);
        switch (this._touchType) {
            case E_TouchType.SwallowForbidden:
                // 不允许穿透
                if (e.eventPhase === Event.CAPTURING_PHASE) {
                    transform.hitTest(e.getLocation()) && this._setClicked();
                } else {
                    e.propagationStopped = true;
                    this._setClicked();
                }
                break;
            case E_TouchType.SwallowAllowedButRectLimited:
                // 允许穿透，且限定落点在节点内部
                transform.hitTest(e.getLocation()) && this._setClicked();
                break;
            case E_TouchType.SwallowAllowedWithoutRectLimited:
            default:
                // 允许穿透，且不限定落点在节点内部
                this._setClicked();
                break;
        }
    }

    private _setClicked() {
        this.i(`Clicked`);
        this._setColor(Color.WHITE);
        // this.node.dispatchEvent(new MyEvent("clicked", true, this.node.name));
    }

    private _onTouched(e: EventTouch) {
        this._setColor(this._color);
    }

    private _setColor(c: Color) {
        this.node.getComponent(Sprite).color = c;
    }

    private _onClicked(e: MyEvent) {
        this.i(`Clicked`, `current: ${e.currentTarget.name}`, `from: ${e.target.name}`);
    }
}
