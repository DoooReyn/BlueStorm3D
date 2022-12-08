import { _decorator } from "cc";
import { CE_UI_Type } from "../ui_base";
import { UiDisableTouch } from "../ui_disable_touch";
const { ccclass, property } = _decorator;

@ccclass("ui_screen_base")
export class UiScreenBase extends UiDisableTouch {
    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Screen;
}
