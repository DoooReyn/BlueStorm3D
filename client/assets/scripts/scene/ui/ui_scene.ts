import { _decorator } from "cc";
import { disableDomErrorNode } from "../../base/func/utils";
import { Gossip } from "../../base/ui/add_ons/gossip";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/ui_scene.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 20:35:44 GMT+0800 (中国标准时间)
 * Class    : UiScene
 * Desc     : Ui 测试场景
 */
@ccclass("ui_scene")
export class UiScene extends Gossip {
    onLoad() {
        disableDomErrorNode();
    }
}
