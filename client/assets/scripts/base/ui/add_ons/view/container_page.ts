import { _decorator, Node } from "cc";
import { Gossip } from "../gossip";
import { E_Container_Event } from "./container_base";
import { PageItem } from "./page_item";
import { PageViewBase } from "./page_view_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/container_page.ts
 * Author   : reyn
 * Date     : Wed Dec 21 2022 10:05:26 GMT+0800 (中国标准时间)
 * Class    : ContainerPage
 * Desc     : 页面容器
 */
@ccclass("container_page")
export class ContainerPage extends Gossip {
    // REGION START <protected>

    protected _displayed: boolean = false;
    protected _item: Node = null;
    protected _page: number = -1;
    protected _view: PageViewBase = null;

    protected onEnable() {
        this.node.on(E_Container_Event.ItemShow, this._onItemShow, this);
        this.node.on(E_Container_Event.ItemHide, this._onItemHide, this);
    }

    protected onDisable() {
        this.node.off(E_Container_Event.ItemShow, this._onItemShow, this);
        this.node.off(E_Container_Event.ItemHide, this._onItemHide, this);
    }

    /**
     * 容器显示
     * @param view 视图
     * @param page 页码
     */
    protected _onItemShow(view: PageViewBase, page: number) {
        this._displayed = true;
        this._view = view;
        this._page = page;

        if (!this._item) {
            this._item = this._view.createPage();
            this._item.parent = this.node;
        }
        this._item.active = true;
        this._item.getComponent(PageItem).reload(true, page);
    }

    /**
     * 容器隐藏
     * @param view 视图
     * @param page 页码
     */
    protected _onItemHide(view: PageViewBase, page: number) {
        this._displayed = false;
        if (this._item) {
            this._item.getComponent(PageItem).reload(true, page);
            this._item.active = false;
        }
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 容器显示否
     */
    public get displayed() {
        return this._displayed;
    }

    // REGION ENDED <public>
}
