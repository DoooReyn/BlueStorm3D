import { _decorator, Sprite, SpriteFrame } from "cc";
import { I_i18nContent } from "./i18n_map";
import { i18nCom } from "./i18n_com";
import { Singletons } from "../singletons";
const { ccclass, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/i18n/i18n_sprite.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Class    : i18nSprite
 * Desc     : 多语言精灵组件
 */
@ccclass("i18nSprite")
@requireComponent(Sprite)
export class i18nSprite extends i18nCom {
    public get sprite(): Sprite {
        return this.getComponent(Sprite) || this.addComponent(Sprite);
    }

    public onI18nContentChanged(content: I_i18nContent): void {
        const image = this.sprite;
        if (content.bundle) {
            Singletons.drm
                .load(content.text, SpriteFrame, content.bundle)
                .then((frame) => frame && Singletons.drm.replace(image, frame));
        }
    }
}
