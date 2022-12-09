import { _decorator } from "cc";
import { Singletons } from "../../singletons";
import { I_UiInfo, UiBase } from "../ui_base";
import { UiMap } from "../ui_map";
import { UiStack } from "../ui_stack";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_dialogs.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:06 GMT+0800 (中国标准时间)
 * Class    : UiDialogs
 * Desc     : Dialog 页面管理
 * - `isOpenAllowed` —— 同一时间不允许存在3个以上页面
 * - `onOpenWhenReachStatckLimit` —— 当超过容纳数量限制时，清空栈并打开新页面
 * - `onOpenBefore` —— 暂时不需要处理
 * - `onOpenAfter` —— 暂时不需要处理
 * - `onOpenCurrent` —— 暂时不需要处理
 * - `onOpenPrevious` —— 打开前置页面需要关闭其上的所有 Dialog
 * - `onClosePrevious` —— 关闭前置页面需要关闭自己和其上的所有 Dialog
 * - `onShowLoading` —— 打开页面之前需要显示 Loading
 * - `onHideLoading` —— 打开页面之后需要关闭 Loading
 */
@ccclass("ui_dialogs")
export class UiDialogs extends UiStack {
    protected isOpenAllowed(): boolean {
        return this.depth <= 3;
    }

    protected onOpenWhenReachStatckLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]) {
        return this.replace<T>(info, ...args);
    }

    protected async onOpenPrevious<T extends UiBase>(index: number): Promise<T | null> {
        this.closeToIndex(index);
        return super.onOpenPrevious<T>(index);
    }

    protected onClosePrevious(index: number, ...args: any[]) {
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
