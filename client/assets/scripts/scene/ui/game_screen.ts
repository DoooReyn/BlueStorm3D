import { EventTouch, _decorator } from "cc";
import { Singletons } from "../../base/singletons";
import { UiScreenBase } from "../../base/ui/screen/ui_screen_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/scene/ui/game_screen.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 20:36:01 GMT+0800 (中国标准时间)
 * Class    : GameScreen
 * Desc     :
 */
@ccclass("GameScreen")
export class GameScreen extends UiScreenBase {
    /************************************************************
     * 基础事件
     ************************************************************/

    onBtnReplaceClicked(_: EventTouch, type: string) {
        let prefab = { HomeScreen: "home_screen", GameScreen: "game_screen" }[type];
        Singletons.ui.screens.open({ path: `prefab/${prefab}` });
    }
}
