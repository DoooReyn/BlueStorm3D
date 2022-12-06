import { _decorator, Component, Node } from "cc";
import { I_UiInfo } from "../ui_base";
import { UiStack } from "../ui_stack";
import { UiScreenBase } from "./ui_screen_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_screens.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:59 GMT+0800 (中国标准时间)
 * Class    : UiScreens
 * Desc     :
 */
@ccclass("UiScreens")
export class UiScreens extends UiStack {
    /************************************************************
     * 基础事件
     ************************************************************/

    protected isOpenAllowed(): boolean {
        return this.depth === 0;
    }
}
