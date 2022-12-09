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
 * - `isOpenAllowed` —— 同一时间有且只能有一个页面
 * - `onOpenWhenReachStatckLimit` —— 当打开另一个页面时，使用新的页面替换旧的页面
 * - `onOpenBefore` —— 打开页面之前需要关闭所有 Layer/Dialog
 * - `onOpenAfter` —— 暂时不需要处理
 * - `onOpenCurrent` —— 再次打开页面需要关闭所有 Layer/Dialog
 * - `onOpenPrevious` —— 因为不存在前置页面，所以不需要处理
 * - `onClosePrevious` —— 因为不存在前置页面，所以不需要处理
 * - `onShowLoading` —— 打开页面之前需要显示 Loading
 * - `onHideLoading` —— 打开页面之后需要关闭 Loading
 */
@ccclass("UiScreens")
export class UiScreens extends UiStack {
    protected isOpenAllowed(): boolean {
        return this.depth === 0;
    }

    protected onOpenWhenReachStatckLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]) {
        return this.replace<T>(info, ...args);
    }

    protected onOpenBefore(ui: UiBase) {
        Singletons.ui.layers.closeAll();
        Singletons.ui.dialogs.closeAll();
        super.onOpenBefore(ui);
    }

    protected onOpenCurrent<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.ui.layers.closeAll();
        Singletons.ui.dialogs.closeAll();
        return super.onOpenCurrent<T>(index);
    }

    protected async onShowLoading() {
        await Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
