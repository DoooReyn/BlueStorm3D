import { _decorator } from "cc";
import { Singletons } from "../../singletons";
import { I_UiInfo, UiBase } from "../ui_base";
import { UiMap } from "../ui_map";
import { UiStack } from "../ui_stack";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_screens.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:59 GMT+0800 (中国标准时间)
 * Class    : UiScreens
 * Desc     : Screen 页面管理
 */
@ccclass("UiScreens")
export class UiScreens extends UiStack {
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

    protected async onShowLoading() {
        await Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
