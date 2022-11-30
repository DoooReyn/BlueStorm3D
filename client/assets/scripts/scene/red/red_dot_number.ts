import { _decorator, Node, Label } from "cc";
import { RedTree } from "../../base/red/red_tree";
import RedDot from "./red_dot";
const { ccclass, property } = _decorator;

@ccclass
export default class RedDotNumber extends RedDot {
    @property(Label)
    num: Label = null;

    onLoad() {}

    refresh(r: RedTree) {
        this.num.string = `${r.count}`;
        this.num.node.active = r.on;
        super.refresh(r);
    }
}
