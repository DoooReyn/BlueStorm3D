import { _decorator, Component, Node } from "cc";
import { CE_UI_Type, UiBase } from "../ui_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_tip_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:08 GMT+0800 (中国标准时间)
 * Class    : UiTipBase
 * Desc     : Tip 页面基类
 * - 一般指提示类节点，如：走马灯通知、道具获取通知、网络信号差提示等
 */
@ccclass("ui_tip_base")
export class UiTipBase extends UiBase {
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Tip;
}
