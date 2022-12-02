import { I_i18nContent } from "./i18n_map";
import { _decorator, Label } from "cc";
import { i18nCom } from "./i18n_com";
const { ccclass, requireComponent } = _decorator;

/**
 * Url      : db://assets/scripts/base/i18n/i18n_label.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Desc     : 多语言文本组件
 */
@ccclass("i18nLabel")
@requireComponent(Label)
export class i18nLabel extends i18nCom {
    public onI18nContentChanged(content: I_i18nContent): void {
        this.getComponent(Label).string = content.text;
    }
}
