import { _decorator, Component, EventTouch } from "cc";
import { i18nLabel } from "../../base/i18n/i18n_label";
import { E_SupportLanguages } from "../../base/i18n/i18n_map";
import { i18nSprite } from "../../base/i18n/i18n_sprite";
import { Singletons } from "../../base/singletons";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/i18n/i18n_scene.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 23:08:34 GMT+0800 (中国标准时间)
 * Class    : I18nScene
 * Desc     : 多语言测试
 */
@ccclass("I18nScene")
export class I18nScene extends Component {
    @property(i18nLabel)
    labCurrent: i18nLabel = null;

    @property(i18nLabel)
    labLang: i18nLabel = null;

    @property(i18nLabel)
    labZH: i18nLabel = null;

    @property(i18nLabel)
    labEN: i18nLabel = null;

    @property(i18nSprite)
    imgAlbum: i18nSprite = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        Singletons.i18n;
    }

    onBtnClicked(e: EventTouch, type: string) {
        switch (type) {
            case "ZH":
                Singletons.i18n.lang = E_SupportLanguages.ZH;
                break;
            case "EN":
                Singletons.i18n.lang = E_SupportLanguages.EN;
                break;
        }
    }
}
