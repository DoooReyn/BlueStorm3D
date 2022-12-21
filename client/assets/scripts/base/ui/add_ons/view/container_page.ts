import { _decorator, Node } from "cc";
import { Gossip } from "../gossip";
import { E_Container_Event } from "./container_base";
import { PageContainers } from "./page_containers";
import { PageViewBase } from "./page_view_base";
const { ccclass, property } = _decorator;

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
    protected _node: Node = null;
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

    protected _onItemShow(container: PageContainers, view: PageViewBase, page: number) {
        this._view = view;
        this._page = page;
        // if (!this._node) {
        //     this._node = this._view.createPageNode();
        //     this._node.parent = this.node;
        // }
        // this._loadPage();
    }

    protected _onItemHide(view: PageViewBase, page: number) {}

    protected _loadPage() {}

    // REGION ENDED <protected>

    // REGION START <public>

    public get displayed() {
        return this._displayed;
    }

    // REGION ENDED <public>
}
