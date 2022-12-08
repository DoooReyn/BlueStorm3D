import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import { randomInteger } from "../../base/func/random";
import { Singletons } from "../../base/singletons";
import { UiDialogBase } from "../../base/ui/dialog/ui_dialog_base";
import { UiMap } from "../../base/ui/ui_map";
import { ItemDetailConfig } from "../../config/item_detail_config";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/item_buy_dialog.ts
 * Author   : reyn
 * Date     : Wed Dec 07 2022 15:23:34 GMT+0800 (中国标准时间)
 * Desc     :
 */
@ccclass("ItemBuyDialog")
export class ItemBuyDialog extends UiDialogBase {
    @property({ displayName: "名称", type: Label })
    uiLabName: Label = null;

    @property({ displayName: "描述", type: Label })
    uiLabDesc: Label = null;

    @property({ displayName: "icon", type: Sprite })
    uiSpriteIcon: Sprite = null;

    private _itemId: number = 0;

    public playOpen(itemInfo: { id: string }) {
        super.playOpen(itemInfo);
        const conf = ItemDetailConfig[itemInfo.id];
        this.i(`打开道具: ${conf.id}`);
        this._itemId = conf.id;
        this.uiLabName.string = conf.name;
        this.uiLabDesc.string = conf.desc;
        Singletons.drm.load<SpriteFrame>(`item/${itemInfo.id}`, SpriteFrame).then((frame) => {
            frame && Singletons.drm.replace(this.uiSpriteIcon, frame);
            this.uiSpriteIcon.spriteFrame = frame;
        });
    }

    onBtnShopClicked() {
        Singletons.ui.dialogs.replace(UiMap.BuyConfirmDialog, { from: "Shop", id: this._itemId });
    }
}
