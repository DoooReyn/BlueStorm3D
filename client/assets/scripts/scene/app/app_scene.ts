import { _decorator, Component, Node } from "cc";
import { Singletons } from "../../base/singletons";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/app/app_scene.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:34:28 GMT+0800 (中国标准时间)
 * Class    : AppScene
 * Desc     :
 */
@ccclass("AppScene")
export class AppScene extends Component {
    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        Singletons.log.d(`日志开关: ${Singletons.log.on}`);
        Singletons.log.d(`日志等级: ${Singletons.log.level}`);
        Singletons.store.init("BlueStorm3");
    }

    onDestroy() {}

    onEnable() {
        Singletons.log.i(`${this.node.name} onEnable`);
    }

    onDisable() {
        Singletons.log.e(`${this.node.name} onDisable`);
    }

    start() {
        Singletons.log.w(`${this.node.name} start`);
    }

    // update(dt: number) {}

    // lateUpdate(dt: number) {}
}
