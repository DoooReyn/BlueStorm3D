import { Label, Sprite, SpriteFrame, _decorator } from "cc";
import { Singletons } from "../../base/singletons";
import { UiDialogBase } from "../../base/ui/dialog/ui_dialog_base";
import { ItemDetailConfig } from "../../config/item_detail_config";
const { ccclass, property } = _decorator;

@ccclass
export class BuyConfirmDialog extends UiDialogBase {
    @property({ displayName: "名称", type: Label })
    uiLabName: Label = null;

    @property({ displayName: "icon", type: Sprite })
    uiSpriteIcon: Sprite = null;

    public playOpen(itemInfo: { id: string }) {
        super.playOpen(itemInfo);
        const itemId = `item_${itemInfo.id}`;
        const conf = ItemDetailConfig[itemId];
        Singletons.log.i(`[ItemDetailDialog] 打开道具: ${conf.id}`);
        this.uiLabName.string = conf.name;
        Singletons.drm.load<SpriteFrame>(`item/${itemId}`, SpriteFrame).then((frame) => {
            frame && Singletons.drm.replace(this.uiSpriteIcon, frame);
            this.uiSpriteIcon.spriteFrame = frame;
        });
    }
}
