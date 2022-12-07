import { _decorator, Button } from "cc";
import { i18nLabel } from "../../i18n/i18n_label";
import { addClickHandler } from "../add_ons/ui_helper";
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

    @property({ displayName: "返回按钮", type: Button })
    uiBtnBack: Button = null;

    @property({ displayName: "标题文本", type: i18nLabel })
    uiLabTitle: i18nLabel = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    protected onLoad() {
        super.onLoad && super.onLoad();
        addClickHandler(this.uiBtnBack, this.node, "UiLayerBase", "onCloseBtnTriggered");
    }
}
