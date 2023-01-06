import { _decorator } from "cc";
import { isInRange } from "../../func/numbers";
import { ButtonCheckable, ButtonCheckableEvent } from "./button_checkable";
import { Gossip } from "./gossip";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/button_group.ts
 * Author   : reyn
 * Date     : Fri Jan 06 2023 16:55:13 GMT+0800 (中国标准时间)
 * Class    : ButtonGroup
 * Desc     : 互斥按钮组
 */
@ccclass("button_group")
export class ButtonGroup extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "按钮列表", type: [ButtonCheckable] })
    protected buttons: ButtonCheckable[] = [];

    @property({ displayName: "初始索引" })
    protected index: number = 0;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(ButtonCheckable.EventChecked, this._onButtonChecked, this);
    }

    protected onDisable() {
        this.node.off(ButtonCheckable.EventChecked, this._onButtonChecked, this);
    }

    protected start() {
        this.buttons.forEach((v) => {
            v.checkAtOnce = false;
            v.isInMutexGroup = true;
            v.setChecked(false);
        });
        this.setIndex(this.index);
    }

    /**
     * 按钮选中状态切换事件回调
     * @param e 按钮选中状态切换事件
     */
    protected _onButtonChecked(e: ButtonCheckableEvent) {
        e.propagationStopped = true;
        if (e.type === ButtonCheckable.EventChecked) {
            this.buttons.forEach((v) => e.button !== v && v.setChecked(false));
        }
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 是否有效的按钮组索引
     * @param index 索引
     * @returns
     */
    public isValidIndex(index: number) {
        return isInRange(index, 0, this.buttons.length);
    }

    /**
     * 设置当前按钮组索引
     * @param index 索引
     */
    public setIndex(index: number) {
        index = index | 0;
        if (this.isValidIndex(index)) {
            this.index = index;
            this.buttons[index].setChecked(true);
        }
    }

    /**
     * 获取当前按钮组索引
     */
    public get currentIndex() {
        return this.index;
    }

    // REGION ENDED <public>
}
