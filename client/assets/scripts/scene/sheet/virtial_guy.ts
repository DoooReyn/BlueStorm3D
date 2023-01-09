import { _decorator } from "cc";
import { Animation } from "../../base/ui/add_ons/animate/animation";
import { Sheet } from "../../base/ui/add_ons/animate/sheet";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/sheet/virtial_guy.ts
 * Author   : reyn
 * Date     : Mon Jan 09 2023 16:34:04 GMT+0800 (中国标准时间)
 * Class    : VirtialGuy
 * Desc     : 序列帧动画 demo
 */
@ccclass("virtial_guy")
export class VirtialGuy extends Sheet {
    // REGION START <Member Variables>

    @property({ displayName: "idle", type: Animation })
    idle: Animation = null;

    @property({ displayName: "hit", type: Animation })
    hit: Animation = null;

    @property({ displayName: "run", type: Animation })
    run: Animation = null;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected start() {
        (<any>window).virtial_guy = this;
        this.addAnimation(this.idle);
        this.addAnimation(this.hit);
        this.addAnimation(this.run);
        this.play(this.idle.tag, true);
    }

    // REGION ENDED <protected>
}
