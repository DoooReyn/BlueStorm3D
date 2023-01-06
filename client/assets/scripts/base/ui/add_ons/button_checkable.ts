import { _decorator, Node, EventHandler, Event } from "cc";
import { AutomaticBooleanValue } from "../../func/automatic_value";
import { Gossip } from "./gossip";
const { ccclass, property } = _decorator;

export class ButtonCheckableEvent extends Event {
    public button: ButtonCheckable = null;

    constructor(button: ButtonCheckable, type: string, bubbles: boolean = true) {
        super(type, bubbles);
        this.button = button;
    }
}

/**
 * Url      : db://assets/scripts/base/ui/add_ons/button_checkable.ts
 * Author   : reyn
 * Date     : Fri Jan 06 2023 15:33:09 GMT+0800 (中国标准时间)
 * Class    : ButtonCheckable
 * Desc     : 可选中的按钮
 */
@ccclass("button_checkable")
export class ButtonCheckable extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "初始选中状态" })
    public initStatus: boolean = true;

    @property({ displayName: "是否立即检查选中状态" })
    public checkAtOnce: boolean = true;

    @property({ displayName: "是否属于互斥组" })
    public isInMutexGroup: boolean = false;

    @property({ displayName: "选中节点", type: Node })
    public checkedNode: Node = null;

    @property({ displayName: "选中状态切换事件", type: [EventHandler] })
    protected events: EventHandler[] = [];

    /**
     * 选中状态
     */
    protected checked: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    /**
     * 选中事件名称
     */
    public static readonly EventChecked: string = "checked";

    /**
     * 取消选中事件名称
     */
    public static readonly EventUnchecked: string = "unchecked";

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(Node.EventType.TOUCH_END, this.switch, this);
    }

    protected onDisable() {
        this.node.off(Node.EventType.TOUCH_END, this.switch, this);
    }

    protected start() {
        if (!this.isInMutexGroup) {
            this.checkAtOnce && this.setChecked(this.initStatus);
        }
    }

    /**
     * 选中状态变化回调
     */
    protected _onCheckStatusChanged() {
        this.checkedNode.active = this.isChecked;
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 设置选中/取消选中
     * @param checked
     */
    public setChecked(checked: boolean) {
        checked ? this.checked.set() : this.checked.unset();
        this._onCheckStatusChanged();
        this.events.forEach((e) => e.emit([checked, e.customEventData]));
        const e = checked ? ButtonCheckable.EventChecked : ButtonCheckable.EventUnchecked;
        this.node.dispatchEvent(new ButtonCheckableEvent(this, e));
    }

    /**
     * 是否选中
     */
    public get isChecked() {
        return this.checked.isset();
    }

    /**
     * 切换选中状态
     */
    public switch() {
        if (this.isInMutexGroup) {
            !this.isChecked && this.setChecked(true);
        } else {
            this.setChecked(!this.checked.isset());
        }
    }

    // REGION ENDED <public>
}
