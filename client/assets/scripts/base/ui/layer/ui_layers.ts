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
@ccclass("ui_layers")
export class UiLayers extends UiStack {
    protected isOpenAllowed(): boolean {
        return true;
    }

    /**
     * 打开新的 Screen 之前
     * - 策略：关闭所有弹窗
     * @param ui 当前 Ui 组件
     */
    protected onOpenBefore(ui: UiBase) {
        Singletons.ui.dialogs.closeAll();
    }

    /**
     * 打开前置 Screen
     * - 策略：关闭前置 Screen 以上的 Screen
     * @param index 前置 Screen 所在的栈深度
     */
    protected async onOpenPrevious<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.ui.dialogs.closeAll();
        this.closeToIndex(index);
        return super.onOpenPrevious<T>(index);
    }

    /**
     * 已打开的情况下再次打开 Screen
     * - 策略：关闭所有弹窗
     * @param index 前置 Screen 所在的栈深度
     */
    protected async onOpenCurrent<T extends UiBase>(index: number): Promise<T | null> {
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
