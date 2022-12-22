import { Label, _decorator } from "cc";
import { Gossip } from "../gossip";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/page_item.ts
 * Author   : reyn
 * Date     : Sat Dec 10 2022 10:08:01 GMT+0800 (中国标准时间)
 * Class    : PageItem
 * Desc     : 翻页视图页面子项
 */
@ccclass("page_item")
export class PageItem extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "文本", type: Label })
    label: Label = null;

    // REGION ENDED <Member Variables>

    // REGION START <public>

    public reload(visible: boolean, index: number) {
        if (visible) {
            this.label.string = `This is page ${index + 1}`;
        }
    }

    // REGION ENDED <public>
}
