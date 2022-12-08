import { _decorator, Button } from "cc";
import { i18nLabel } from "../../i18n/i18n_label";
import { addClickHandler } from "../add_ons/ui_helper";
import { CE_UI_Type } from "../ui_base";
import { UiDisableTouch } from "../ui_disable_touch";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_layer.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:12 GMT+0800 (中国标准时间)
 * Class    : UiLayer
 * Desc     : Layer 页面基类
 * - 一般指大于等于二级的页面
 */
@ccclass("UiLayerBase")
export class UiLayerBase extends UiDisableTouch {
    // REGION START <Member Variables>
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Layer;

    @property({ displayName: "返回按钮", type: Button })
    uiBtnBack: Button = null;

    @property({ displayName: "标题文本", type: i18nLabel })
    uiLabTitle: i18nLabel = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        super.onLoad && super.onLoad();
        addClickHandler(this.uiBtnBack, this.node, "UiLayerBase", "onCloseBtnTriggered");
    }

    // REGION ENDED <protected>
}
