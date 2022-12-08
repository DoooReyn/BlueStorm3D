import { Button, _decorator, Node } from "cc";
import { Singletons } from "../../base/singletons";
import { E_UIButtonEventType } from "../../base/ui/add_ons/ui_button_hack";
import { UiLayerBase } from "../../base/ui/layer/ui_layer_base";
import { UiMap } from "../../base/ui/ui_map";

const { ccclass, property } = _decorator;
/**
 * Url      : db://assets/scripts/scene/ui/shop_layer.ts
 * Author   : reyn
 * Date     : Wed Dec 07 2022 15:23:18 GMT+0800 (中国标准时间)
 * Desc     :
 */
@ccclass("ShopLayer")
export class ShopLayer extends UiLayerBase {
    @property({ displayName: "道具面板", type: Node })
    uiFrameItem: Node = null;

    protected onEnable() {
        // 这里为了快速展示，把道具点击监听放在这里，实际上应该在道具预制体上制作
        this.uiFrameItem.children.forEach((v) => {
            v.on(E_UIButtonEventType.CLICK, this._onItemClicked, this);
        });
        super.onEnable && super.onEnable();
    }

    protected onDisable() {
        this.uiFrameItem.children.forEach((v) => {
            v.off(E_UIButtonEventType.CLICK, this._onItemClicked, this);
        });
        super.onDisable && super.onDisable();
    }

    private _onItemClicked(button: Button) {
        this.i(`点击道具: ${button.node.name}`);
        Singletons.ui.dialogs.open(UiMap.ItemBuyDialog, { id: button.node.name });
    }
}
