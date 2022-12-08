import { _decorator, Label } from "cc";
import { I_RedDotCom, RedDotNode } from "./red_dot_tree";
import RedDotPure from "./red_dot_pure";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/red/red_dot_number.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:42:56 GMT+0800 (中国标准时间)
 * Class    : RedDotNumber
 * Desc     : 数字红点
 */
@ccclass
export default class RedDotNumber extends RedDotPure implements I_RedDotCom {
    @property(Label)
    num: Label = null;

    refresh(r: RedDotNode) {
        this.num.string = `${r.getNumber()}`;
        this.num.node.active = r.hasRed();
        super.refresh(r);
    }
}
