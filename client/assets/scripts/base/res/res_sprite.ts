import { _decorator, Sprite, SpriteFrame } from "cc";
import { Singletons } from "../singletons";
import { Gossip } from "../ui/add_ons/gossip";
const { ccclass, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/res/res_sprite.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Class    : ResSprite
 * Desc     : 动态精灵组件
 */
@ccclass("ResSprite")
@requireComponent(Sprite)
export class ResSprite extends Gossip {
    public get sprite(): Sprite {
        return this.setupComponent(Sprite);
    }

    public setSpriteFrame(path: string, bundle?: string): void {
        const image = this.sprite;
        Singletons.drm.load(path, SpriteFrame, bundle).then((frame) => frame && Singletons.drm.replace(image, frame));
    }
}
