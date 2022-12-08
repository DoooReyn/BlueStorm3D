import { _decorator } from "cc";
import { CE_UI_Type } from "../ui_base";
import { UiDisableTouch } from "../ui_disable_touch";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_screens_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:59 GMT+0800 (中国标准时间)
 * Class    : UiScreenBase
 * Desc     : Screen 页面基类
 * - 一般指一级页面，如：登录页面、游戏大厅、战斗页面
 */
@ccclass("ui_screen_base")
export class UiScreenBase extends UiDisableTouch {
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Screen;
}
