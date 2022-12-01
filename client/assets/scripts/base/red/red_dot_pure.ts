import { _decorator, Component, Node } from "cc";
import { I_RedDotCom, RedDotNode } from "./red_dot_tree";
const { ccclass, property } = _decorator;

@ccclass
export default class RedDotPure extends Component implements I_RedDotCom {
    @property(Node)
    red: Node = null;

    onLoad() {}

    refresh(r: RedDotNode) {
        this.red.active = r.hasRed();
    }
}
