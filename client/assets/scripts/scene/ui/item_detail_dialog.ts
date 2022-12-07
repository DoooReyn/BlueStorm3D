import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import { randomInteger } from "../../base/func/random";
import { Singletons } from "../../base/singletons";
import { UiDialogBase } from "../../base/ui/dialog/ui_dialog_base";
import { UiMap } from "../../base/ui/ui_map";
import { ItemDetailConfig } from "../../config/item_detail_config";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/item_detail_dialog.ts
 * Author   : reyn
 * Date     : Wed Dec 07 2022 15:23:34 GMT+0800 (中国标准时间)
 * Desc     :
 */
@ccclass("ItemDetailDialog")
export class ItemDetailDialog extends UiDialogBase {
    @property({ displayName: "标题", type: Label })
    uiLabTitle: Label = null;

    @property({ displayName: "名称", type: Label })
    uiLabName: Label = null;

    @property({ displayName: "数量", type: Label })
    uiLabNum: Label = null;

    @property({ displayName: "描述", type: Label })
    uiLabDesc: Label = null;

    @property({ displayName: "icon", type: Sprite })
    uiSpriteIcon: Sprite = null;

    private _itemId: number = 0;

    public playOpen(itemInfo: { id: string }) {
        super.playOpen(itemInfo);
        const conf = ItemDetailConfig[itemInfo.id];
        Singletons.log.i(`[ItemDetailDialog] 打开道具: ${conf.id}`);
        this._itemId = conf.id;
        this.uiLabName.string = conf.name;
        this.uiLabDesc.string = conf.desc;
        this.uiLabNum.string = randomInteger(1, 10).toString();
        Singletons.drm.load<SpriteFrame>(`item/${itemInfo.id}`, SpriteFrame).then((frame) => {
            frame && Singletons.drm.replace(this.uiSpriteIcon, frame);
            this.uiSpriteIcon.spriteFrame = frame;
        });
    }

    onBtnShopClicked() {
        Singletons.ui.layers.open(UiMap.ShopLayer, { from: "Bag", itemId: this._itemId });
    }
}
