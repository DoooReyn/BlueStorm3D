import { Label, Sprite, _decorator, SpriteFrame } from "cc";
import { Singletons } from "../../base/singletons";
import { Gossip } from "../../base/ui/add_ons/gossip";
import { E_Container_Event, ViewItemEvent } from "../../base/ui/add_ons/view/container_base";
import { ScrollViewBase } from "../../base/ui/add_ons/view/scroll_view_base";
import { I_Fixed_Data } from "./fixed_scroll_scene";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/scroll/fixed_scroll_item.ts
 * Author   : reyn
 * Date     : Fri Dec 16 2022 16:23:09 GMT+0800 (中国标准时间)
 * Class    : FixedScrollItem
 * Desc     :
 */
@ccclass("fixed_scroll_item")
export class FixedScrollItem extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "icon", type: Sprite })
    icon: Sprite = null;

    @property({ displayName: "描述", type: Label })
    desc: Label = null;

    private _index: number = -1;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(E_Container_Event.ItemShow, this._onShow, this);
        this.node.on(E_Container_Event.ItemHide, this._onHide, this);
    }

    protected onDisable() {
        this.node.on(E_Container_Event.ItemShow, this._onShow, this);
        this.node.on(E_Container_Event.ItemHide, this._onHide, this);
    }

    protected _onShow(index: number, data: I_Fixed_Data) {
        this._index = index;
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

    // REGION START <public>

    public removeFromView() {
        this.node.dispatchEvent(new ViewItemEvent(ScrollViewBase.EVENT_ITEM_REMOVE_FROM_VIEW, this._index));
    }

    // REGION ENDED <public>
}
