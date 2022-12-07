import { _decorator } from "cc";
import { CE_UI_Type, UiBase } from "../ui_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_dialog_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:35 GMT+0800 (中国标准时间)
 * Class    : UiDialogBase
 * Desc     :
 */
@ccclass("UiDialogBase")
export class UiDialogBase extends UiBase {
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Dialog;
}
