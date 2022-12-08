import { Component, _decorator } from "cc";
import { AutomaticValue } from "../../func/automatic_value";
import { Singletons } from "../../singletons";

const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/gossip.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : Gossip
 * Desc     : 调试信息输出组件
 */
@ccclass("gossip")
export class Gossip extends Component {
    /**
     * 输出调试信息开关
     */
    protected debuggable: AutomaticValue<boolean> = new AutomaticValue<boolean>(true);

    /**
     * 输出调试信息
     * @param args 参数列表
     */
    protected d(...args: any[]) {
        this.debuggable.value && Singletons.log.d(this.name, ...args);
    }
    protected i(...args: any[]) {
        this.debuggable.value && Singletons.log.i(this.name, ...args);
    }
    protected w(...args: any[]) {
        this.debuggable.value && Singletons.log.w(this.name, ...args);
    }
    protected e(...args: any[]) {
        this.debuggable.value && Singletons.log.e(this.name, ...args);
    }
}
