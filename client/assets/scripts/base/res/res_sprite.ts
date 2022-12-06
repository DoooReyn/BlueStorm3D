import { _decorator, Sprite, SpriteFrame, Component } from "cc";
import { Singletons } from "../singletons";
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
export class ResSprite extends Component {
    public get sprite(): Sprite {
        return this.getComponent(Sprite) || this.addComponent(Sprite);
    }

    public setSpriteFrame(path: string, bundle?: string): void {
        const image = this.sprite;
        Singletons.drm
            .load(path, SpriteFrame, bundle || "resources")
            .then((frame) => frame && Singletons.drm.replace(image, frame));
    }
}
