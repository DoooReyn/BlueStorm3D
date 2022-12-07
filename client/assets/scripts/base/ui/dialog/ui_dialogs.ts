import { _decorator, Component, Node } from "cc";
import { Singletons } from "../../singletons";
import { UiBase } from "../ui_base";
import { UiMap } from "../ui_map";
import { UiStack } from "../ui_stack";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_dialogs.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:06 GMT+0800 (中国标准时间)
 * Class    : UiDialogs
 * Desc     :
 */
@ccclass("UiDialogs")
export class UiDialogs extends UiStack {
    protected isOpenAllowed(): boolean {
        return true;
    }

    protected onShowLoading() {
        Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
