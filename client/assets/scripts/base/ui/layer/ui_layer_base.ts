import { _decorator, Component, Node } from "cc";
import { CE_UI_Type, UiBase } from "../ui_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_layer.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:12 GMT+0800 (中国标准时间)
 * Class    : UiLayer
 * Desc     :
 */
@ccclass("UiLayerBase")
export class UiLayerBase extends UiBase {
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Layer;

    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {}

    onDestroy() {}

    onEnable() {}

    onDisable() {}

    start() {}

    // update(dt: number) {}

    // lateUpdate(dt: number) {}
}
