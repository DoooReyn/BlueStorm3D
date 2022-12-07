import { _decorator, Component, Node } from "cc";
import { Singletons } from "../../singletons";
import { I_UiInfo, UiBase } from "../ui_base";
import { UiMap } from "../ui_map";
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

    protected onOpenLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]) {
        return this.replace<T>(info, ...args);
    }

    protected onOpenBefore(ui: UiBase) {
        Singletons.ui.layers.closeAll();
        Singletons.ui.dialogs.closeAll();
        Singletons.ui.tips.closeAll();
    }

    protected onShowLoading() {
        Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
