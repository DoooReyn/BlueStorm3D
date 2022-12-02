import { I_i18nContent } from "./i18n_map";
import { _decorator, Sprite, assetManager, SpriteFrame, resources } from "cc";
import { i18nCom } from "./i18n_com";
const { ccclass, requireComponent } = _decorator;

@ccclass("i18nSprite")
@requireComponent(Sprite)
export class i18nSprite extends i18nCom {
    public onI18nContentChanged(content: I_i18nContent): void {
        const image = this.getComponent(Sprite);
        if (content.bundle) {
            assetManager.loadBundle(content.bundle, (err1, bundle) => {
                if (err1) return console.error(err1);
                bundle.load(
                    `${content.text}/spriteFrame`,
                    SpriteFrame,
                    null,
                    (err2, frame) => {
                        if (err2) return console.error(err2);
                        image.spriteFrame && image.spriteFrame.decRef();
                        frame.addRef();
                        image.spriteFrame = frame;
                    }
                );
            });
        }
    }
}
