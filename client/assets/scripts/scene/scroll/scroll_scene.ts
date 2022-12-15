import { _decorator, Node, Label } from "cc";
import { disableDomErrorNode } from "../../base/func/utils";
import { Gossip } from "../../base/ui/add_ons/gossip";
import { ScrollBothView } from "../../base/ui/add_ons/view/scroll_both_view";
import { ScrollHorizontalView } from "../../base/ui/add_ons/view/scroll_horizontal_view";
import { ScrollVerticalView } from "../../base/ui/add_ons/view/scroll_vertical_view";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/scroll/scroll_scene.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 14:53:08 GMT+0800 (中国标准时间)
 * Class    : ScrollScene
 * Desc     : 滚动视图测试场景
 */
@ccclass("scroll_scene")
export class ScrollScene extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "水平滚动视图", type: ScrollHorizontalView })
    h_view: ScrollHorizontalView = null;

    @property({ displayName: "垂直滚动视图", type: ScrollVerticalView })
    v_view: ScrollVerticalView = null;

    @property({ displayName: "双向滚动视图", type: ScrollBothView })
    b_view: ScrollBothView = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        disableDomErrorNode();
    }

    protected start() {
        this.i(this.h_view, this.v_view, this.b_view);
        this.h_view.contentNode.children.forEach(this._onInitItem);
        this.v_view.contentNode.children.forEach(this._onInitItem);
        this.b_view.contentNode.children.forEach(this._onInitItem);
    }

    protected _onInitItem(node: Node, index: number) {
        node.getChildByPath("Button/Label").getComponent(Label).string = `${index + 1}`;
    }

    // REGION ENDED <protected>
}
