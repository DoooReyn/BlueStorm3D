import { I_i18nContent } from "./i18n_map";
import { _decorator, Label } from "cc";
import { i18nCom } from "./i18n_com";
const { ccclass, requireComponent } = _decorator;

@ccclass("i18nLabel")
@requireComponent(Label)
export class i18nLabel extends i18nCom {
    public onI18nContentChanged(content: I_i18nContent): void {
        this.getComponent(Label).string = content.text;
    }
}
