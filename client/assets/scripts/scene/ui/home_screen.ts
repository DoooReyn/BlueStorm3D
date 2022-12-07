import { _decorator, EventTouch } from "cc";
import { Singletons } from "../../base/singletons";
import { UiScreenBase } from "../../base/ui/screen/ui_screen_base";
import { UiMap } from "../../base/ui/ui_map";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/home_screen.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 20:36:01 GMT+0800 (中国标准时间)
 * Class    : HomeScreen
 * Desc     :
 */
@ccclass("HomeScreen")
export class HomeScreen extends UiScreenBase {
    /************************************************************
     * 基础事件
     ************************************************************/

    onBtnReplaceClicked(_: EventTouch, type: string) {
        let uiInfo = UiMap[type];
        uiInfo && Singletons.ui.screens.open(uiInfo);
    }

    onBtnBagClicked(_: EventTouch) {
        Singletons.ui.layers.open(UiMap.BagLayer);
    }
}
