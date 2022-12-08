import { _decorator } from "cc";
import { Singletons } from "../../singletons";
import { UiBase } from "../ui_base";
import { UiMap } from "../ui_map";
import { UiStack } from "../ui_stack";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_layers.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:14 GMT+0800 (中国标准时间)
 * Class    : UiLayers
 * Desc     : Layer 页面管理
 */
@ccclass("UiLayers")
export class UiLayers extends UiStack {
    protected isOpenAllowed(): boolean {
        return true;
    }

    protected onOpenBefore(ui: UiBase) {
        Singletons.ui.dialogs.closeAll();
    }

    protected async onOpenAgain<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.ui.dialogs.closeAll();
        return Promise.resolve(this.getUi(index) as T);
    }

    protected async onShowLoading() {
        await Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
