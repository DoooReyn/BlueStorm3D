import { _decorator } from "cc";
import { UiBase, I_UiInfo } from "../ui_base";
import { UiStack } from "../ui_stack";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_loadings.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:21 GMT+0800 (中国标准时间)
 * Class    : UiLoadings
 * Desc     : Loading 页面管理
 * - `isOpenAllowed` —— 同一时间只能存在一个页面
 * - `onOpenWhenReachStatckLimit` —— 当打开另一个页面时，使用新的页面替换旧的页面
 * - `onOpenBefore` —— 暂时不需要处理
 * - `onOpenAfter` —— 暂时不需要处理
 * - `onOpenCurrent` —— 暂时不需要处理
 * - `onOpenPrevious` —— 因为不存在前置页面，所以不需要处理
 * - `onClosePrevious` —— 因为不存在前置页面，所以不需要处理
 * - `onShowLoading` —— 因为自身就是 Loading，所以不需要处理
 * - `onHideLoading` —— 因为自身就是 Loading，所以不需要处理
 */
@ccclass("ui_loadings")
export class UiLoadings extends UiStack {
    protected isOpenAllowed(): boolean {
        return this.depth === 0;
    }

    protected async onOpenWhenReachStatckLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        return this.replace<T>(info, ...args);
    }
}
