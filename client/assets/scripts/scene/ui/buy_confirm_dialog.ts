import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import { Singletons } from "../../base/singletons";
import { UiDialogBase } from "../../base/ui/dialog/ui_dialog_base";
import { ItemDetailConfig } from "../../config/item_detail_config";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/buy_confirm_dialog.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 20:36:01 GMT+0800 (中国标准时间)
 * Class    : BuyConfirmDialog
 * Desc     : 商品购买成功确认弹窗
 */
@ccclass("buy_confirm_dialog")
export class BuyConfirmDialog extends UiDialogBase {
    @property({ displayName: "名称", type: Label })
    uiLabName: Label = null;

    @property({ displayName: "icon", type: Sprite })
    uiSpriteIcon: Sprite = null;

    public playOpen(itemInfo: { id: string }) {
        super.playOpen(itemInfo);
        const itemId = `item_${itemInfo.id}`;
        const conf = ItemDetailConfig[itemId];
        this.i(`打开道具: ${conf.id}`);
        this.uiLabName.string = conf.name;
        Singletons.drm.load<SpriteFrame>({ path: `item/${itemId}` }, SpriteFrame).then((frame) => {
            frame && Singletons.drm.replace(this.uiSpriteIcon, frame);
            this.uiSpriteIcon.spriteFrame = frame;
        });
    }
}
