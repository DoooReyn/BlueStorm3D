import { _decorator, Label } from "cc";
import { I_RedDotCom, RedDotNode } from "./red_dot_tree";
import RedDotPure from "./red_dot_pure";
const { ccclass, property } = _decorator;

@ccclass
export default class RedDotNumber extends RedDotPure implements I_RedDotCom {
    @property(Label)
    num: Label = null;

    onLoad() {}

    refresh(r: RedDotNode) {
        this.num.string = `${r.getNumber()}`;
        this.num.node.active = r.hasRed();
        super.refresh(r);
    }
}
