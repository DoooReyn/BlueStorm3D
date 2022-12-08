import { BlockInputEvents, _decorator } from "cc";
import { UiBase } from "./ui_base";
const { ccclass, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_disable_touch.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : UiDisableTouch
 * Desc     : 禁止穿透的Ui页面组件基类
 */
@ccclass("ui_disable_touch")
@requireComponent(BlockInputEvents)
export class UiDisableTouch extends UiBase {
    protected onLoad() {
        super.onLoad && super.onLoad();
        this.getComponent(BlockInputEvents) || this.addComponent(BlockInputEvents);
    }
}
