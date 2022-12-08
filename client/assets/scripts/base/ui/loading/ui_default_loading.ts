import { _decorator } from "cc";
import { AutomaticValue } from "../../func/automatic_value";
import { UiLoadingBase } from "./ui_loading_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_default_loading.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:59 GMT+0800 (中国标准时间)
 * Class    : UiLoadingBase
 * Desc     : 默认 Loading，常用于短暂的Ui资源加载等待
 */
@ccclass("ui_default_loading")
export class UiDefaultLoading extends UiLoadingBase {
    protected onOpenAgain() {
        this.addRef();
    }

    public playOpen() {
        this.addRef();
    }

    public playClose() {
        this.decRef();
    }
}
