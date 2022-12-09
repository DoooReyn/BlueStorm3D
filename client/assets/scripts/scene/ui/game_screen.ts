import { EventTouch, _decorator } from "cc";
import { Singletons } from "../../base/singletons";
import { UiScreenBase } from "../../base/ui/screen/ui_screen_base";
import { UiMap } from "../../base/ui/ui_map";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/game_screen.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 20:36:01 GMT+0800 (中国标准时间)
 * Class    : GameScreen
 * Desc     : 游戏页面
 */
@ccclass("game_screen")
export class GameScreen extends UiScreenBase {
    /************************************************************
     * 基础事件
     ************************************************************/

    onBtnReplaceClicked(_: EventTouch, type: string) {
        let uiInfo = UiMap[type];
        uiInfo && Singletons.ui.screens.open(uiInfo);
    }
}
