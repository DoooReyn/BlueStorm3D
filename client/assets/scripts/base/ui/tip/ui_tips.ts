import { _decorator, Component, Node } from "cc";
import { UiStack } from "../ui_stack";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_tips.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:34 GMT+0800 (中国标准时间)
 * Class    : UiTips
 * Desc     :
 */
@ccclass("UiTips")
export class UiTips extends UiStack {
    protected isOpenAllowed(): boolean {
        return true;
    }
}
