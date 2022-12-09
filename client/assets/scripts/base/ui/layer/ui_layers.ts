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
 * - `isOpenAllowed` —— 允许存在任意多个页面
 * - `onOpenWhenReachStatckLimit` —— 因为不会触发此条件，所以不需要处理
 * - `onOpenBefore` —— 打开页面之前需要关闭所有 Dialog
 * - `onOpenAfter` —— 暂时不需要处理
 * - `onOpenCurrent` —— 再次打开页面需要关闭所有 Dialog
 * - `onOpenPrevious` —— 打开前置页面需要关闭所有 Dialog，并且关闭其上的所有 Layer
 * - `onClosePrevious` —— 关闭前置页面需要关闭所有 Dialog，并且关闭自己和其上的所有 Layer
 * - `onShowLoading` —— 打开页面之前需要显示 Loading
 * - `onHideLoading` —— 打开页面之后需要关闭 Loading
 */
@ccclass("ui_layers")
export class UiLayers extends UiStack {
    protected isOpenAllowed(): boolean {
        return true;
    }

    protected onOpenBefore(ui: UiBase) {
        Singletons.ui.dialogs.closeAll();
    }

    protected async onOpenPrevious<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.ui.dialogs.closeAll();
        this.closeToIndex(index);
        return super.onOpenPrevious<T>(index);
    }

    protected async onOpenCurrent<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.ui.dialogs.closeAll();
        return super.onOpenCurrent<T>(index);
    }

    protected onClosePrevious(index: number, ...args: any[]) {
        Singletons.ui.dialogs.closeAll();
        this.closeToIndex(index - 1);
        super.onClosePrevious(index, ...args);
    }

    protected async onShowLoading() {
        await Singletons.ui.loadings.open(UiMap.DefaultLoading);
    }

    protected onHideLoading() {
        Singletons.ui.loadings.close(UiMap.DefaultLoading);
    }
}
