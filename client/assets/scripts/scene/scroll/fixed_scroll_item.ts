import { Label, Sprite, _decorator, SpriteFrame } from "cc";
import { ScrollFixedItemBase } from "../../base/ui/add_ons/view/scroll_fixed_item_base";
import { I_Fixed_Data } from "./fixed_scroll_scene";
import { Singletons } from "../../base/singletons";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/scroll/fixed_scroll_item.ts
 * Author   : reyn
 * Date     : Fri Dec 16 2022 16:23:09 GMT+0800 (中国标准时间)
 * Class    : FixedScrollItem
 * Desc     :
 */
@ccclass("fixed_scroll_item")
export class FixedScrollItem extends ScrollFixedItemBase {
    // REGION START <Member Variables>

    @property({ displayName: "icon", type: Sprite })
    icon: Sprite = null;

    @property({ displayName: "描述", type: Label })
    desc: Label = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected _onShow(index: number, data: I_Fixed_Data) {
        super._onShow(index, data);
        this.desc.string = data.desc;
        Singletons.drm.load<SpriteFrame>({ path: `item/item_${data.id}` }, SpriteFrame).then((frame) => {
            frame && (this.icon.spriteFrame = frame);
        });
    }

    protected _onHide(index?: number) {
        Singletons.drm.deprecated(this.icon);
    }

    protected onBtnClicked() {
        this.removeFromView();
    }

    // REGION ENDED <protected>
}
