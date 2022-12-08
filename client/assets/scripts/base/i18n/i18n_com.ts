import { i18nKeyMap, I_i18nContent, I_i18nListener, T_i18nKey } from "./i18n_map";
import { _decorator } from "cc";
import { Singletons } from "../singletons";
import { Gossip } from "../ui/add_ons/gossip";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/i18n/i18n_com.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Desc     : 多语言基础组件
 */
@ccclass("i18n_com")
export abstract class i18nCom extends Gossip implements I_i18nListener {
    @property({ type: i18nKeyMap })
    key = i18nKeyMap.CurrentLanguage;

    protected onEnable() {
        Singletons.i18n.connect(this);
    }

    protected onDisable() {
        Singletons.i18n.disconnect(this);
    }

    public getI18nKey() {
        return i18nKeyMap[this.key] as T_i18nKey;
    }

    public abstract onI18nContentChanged(content: I_i18nContent): void;
}
