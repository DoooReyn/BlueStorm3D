import { _decorator, Component, Node } from "cc";
import { RedTree } from "../../base/red/red_tree";
const { ccclass, property } = _decorator;

@ccclass
export default class RedDot extends Component {
    @property(Node)
    red: Node = null;

    onLoad() {}

    refresh(r: RedTree) {
        console.log(`${r.name}: ${r.count}`);
        this.red.active = r.on;
    }
}
