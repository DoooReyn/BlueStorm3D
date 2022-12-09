import { _decorator, Component } from "cc";
import { Singletons } from "../../base/singletons";
import { Gossip } from "../../base/ui/add_ons/gossip";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/scene/app/app_scene.ts
 * Author   : reyn
 * Date     : Tue Nov 29 2022 21:34:28 GMT+0800 (中国标准时间)
 * Class    : AppScene
 * Desc     : App 场景
 */
@ccclass("app_scene")
export class AppScene extends Gossip {
    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        this.d(`日志开关: ${Singletons.log.on}`);
        this.d(`日志等级: ${Singletons.log.level}`);
        Singletons.store;
    }

    onDestroy() {}

    onEnable() {
        this.i(`onEnable`);
    }

    onDisable() {
        this.e(`onDisable`);
    }

    start() {
        this.w(`start`);
    }
}
