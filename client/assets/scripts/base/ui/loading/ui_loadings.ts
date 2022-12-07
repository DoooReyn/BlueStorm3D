import { _decorator, Component, Node } from "cc";
import { UiBase, I_UiInfo } from "../ui_base";
import { UiStack } from "../ui_stack";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_loadings.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:13:21 GMT+0800 (中国标准时间)
 * Class    : UiLoadings
 * Desc     :
 */
@ccclass("UiLoadings")
export class UiLoadings extends UiStack {
    protected isOpenAllowed(): boolean {
        return this.depth === 0;
    }

    protected async onOpenLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        return this.replace<T>(info, ...args);
    }
}
