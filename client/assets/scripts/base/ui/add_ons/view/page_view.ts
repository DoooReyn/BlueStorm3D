import { _decorator, Node, PageView, Prefab, instantiate } from "cc";
import { Gossip } from "../gossip";
import { getWorldBoundindBoxOf } from "../ui_helper";
import { PageItem } from "./page_item";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/page_view.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 10:06:42 GMT+0800 (中国标准时间)
 * Class    : PageView
 * Desc     :
 */
@ccclass("page_view_ex")
export class PageViewEx extends Gossip {
    // REGION START <Member Variables>
    @property({ displayName: "翻页视图", type: PageView })
    view: PageView = null;

    @property({ displayName: "预制体模板", type: Prefab })
    protected template: Prefab = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    // REGION ENDED <protected>

    // REGION START <public>

    public onEnable() {}

    protected lateUpdate(dt: number) {
        const viewBox = getWorldBoundindBoxOf(this.view.view.node, this.view.view.node);
        viewBox.width -= 2;
        viewBox.height -= 2;
        viewBox.x += 1;
        viewBox.y -= 1;
        const children = this.view.content.children;
        children.forEach((v, i) => {
            let visible = viewBox.intersects(getWorldBoundindBoxOf(v, this.view.node));
            let display = v["__display"];
            if (display === undefined || display !== visible) {
                v["__display"] = visible;
                v.emit("display", visible, i);

                let page: Node = v["page"];
                if (visible) {
                    if (!page) {
                        page = instantiate(this.template);
                        v["page"] = page;
                        v.addChild(page);
                        page.getComponent(PageItem).display(visible, i);
                    }
                } else {
                    if (page) {
                        page.getComponent(PageItem).display(visible, i);
                        page.destroy();
                        v["page"] = null;
                    }
                }
            }
        });
    }

    // REGION ENDED <public>
}
