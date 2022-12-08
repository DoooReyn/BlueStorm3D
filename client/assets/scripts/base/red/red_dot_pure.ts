import { _decorator, Node } from "cc";
import { Gossip } from "../ui/add_ons/gossip";
import { I_RedDotCom, RedDotNode } from "./red_dot_tree";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/red/red_dot_pure.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:42:56 GMT+0800 (中国标准时间)
 * Class    : RedDotPure
 * Desc     : 纯红点
 */
@ccclass
export default class RedDotPure extends Gossip implements I_RedDotCom {
    @property(Node)
    red: Node = null;

    refresh(r: RedDotNode) {
        this.red.active = r.hasRed();
    }
}
