import { _decorator } from "cc";
import { I_Fixed_Data } from "../../../../scene/scroll/fixed_scroll_scene";
import { Gossip } from "../gossip";
import { E_Container_Event, ViewItemEvent } from "./container_base";
import { ScrollViewBase } from "./scroll_view_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_fixed_item_base.ts
 * Author   : reyn
 * Date     : Tue Dec 20 2022 14:46:23 GMT+0800 (中国标准时间)
 * Class    : ScrollFixedItemBase
 * Desc     : 使用固定模板的滚动视图子项基类
 */
@ccclass("scroll_fixed_item_base")
export abstract class ScrollFixedItemBase extends Gossip {
    // REGION START <Member Variables>

    /**
     * 当前索引
     */
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

    /**
     * 进入视图可视范围
     * @param index 当前索引
     * @param data 当前数据
     */
    protected _onShow(index: number, data: I_Fixed_Data) {
        this._index = index;
    }

    /**
     * 离开视图可视范围
     * @param index 当前索引
     */
    protected _onHide(index?: number) {}

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 从视图中移除
     */
    public removeFromView() {
        this.node.dispatchEvent(new ViewItemEvent(ScrollViewBase.EVENT_ITEM_REMOVE_FROM_VIEW, this._index));
    }

    /**
     * 获得当前索引
     */
    public get index() {
        return this._index;
    }

    // REGION ENDED <public>
}
