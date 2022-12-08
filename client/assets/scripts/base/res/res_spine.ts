import { _decorator, sp } from "cc";
import { Singletons } from "../singletons";
import { Gossip } from "../ui/add_ons/gossip";
const { ccclass, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/res/res_sprite.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Class    : ResSpine
 * Desc     : 动态Spine动画组件
 */
@ccclass("ResSpine")
@requireComponent(sp.Skeleton)
export class ResSpine extends Gossip {
    public get spine(): sp.Skeleton {
        return this.getComponent(sp.Skeleton) || this.addComponent(sp.Skeleton);
    }

    public setSpineData(path: string, bundle?: string): void {
        Singletons.drm
            .load(path, sp.SkeletonData, bundle || "resources")
            .then((data) => data && Singletons.drm.replace(this.spine, data));
    }
}
