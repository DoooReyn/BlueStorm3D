import { _decorator, Prefab, Vec3 } from "cc";
import { Gossip } from "../gossip";
import { getWorldBoundindBoxOf } from "../ui_helper";
import { E_Container_Event } from "./container_base";
import { ContainerPage } from "./container_page";
import { E_UiPageView_Direction, PageViewBase } from "./page_view_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/page_containers.ts
 * Author   : reyn
 * Date     : Wed Dec 21 2022 10:27:33 GMT+0800 (中国标准时间)
 * Class    : PageContainers
 * Desc     : 翻页视图容器控制器
 */
@ccclass("page_containers")
export class PageContainers extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "页面模板", type: Prefab })
    protected template: Prefab = null;

    @property({ displayName: "占位容器-上一页", type: ContainerPage })
    protected containerBackward: ContainerPage = null;

    @property({ displayName: "占位容器-当前页", type: ContainerPage })
    protected containerCurrent: ContainerPage = null;

    @property({ displayName: "占位容器-下一页", type: ContainerPage })
    protected containerForward: ContainerPage = null;

    private _containers: ContainerPage[] = null;
    private _locations: Vec3[] = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        this._containers = [this.containerBackward, this.containerCurrent, this.containerForward];
        this._locations = this._containers.map((v) => v.node.position);
    }

    protected _checkContainerVisible(dir: E_UiPageView_Direction, container: ContainerPage, view: PageViewBase) {
        const page = dir === E_UiPageView_Direction.Backward ? view.current - 1 : view.current + 1;
        const valid = view.isPageValid(page);
        if (!valid) return;

        let visible = view.maskBox.intersects(getWorldBoundindBoxOf(container.node, view.maskNode));
        if (container.displayed !== visible) {
            const event = visible ? E_Container_Event.ItemShow : E_Container_Event.ItemHide;
            container.node.emit(event, view, view.current);
        }
    }

    public refresh(view: PageViewBase) {
        this._checkContainerVisible(E_UiPageView_Direction.Backward, this.containerBackward, view);
        this._checkContainerVisible(E_UiPageView_Direction.Forward, this.containerForward, view);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    // public test() {}

    // REGION ENDED <public>
}
