import { _decorator, EventTouch } from "cc";
import { Singletons } from "../../base/singletons";
import { UiScreenBase } from "../../base/ui/screen/ui_screen_base";
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
        let prefab = { HomeScreen: "home_screen", GameScreen: "game_screen" }[type];
        Singletons.ui.screens.open({ path: `prefab/${prefab}` });
    }

    start() {
        Singletons.log.i(this);
    }

    // update(dt: number) {}

    // lateUpdate(dt: number) {}
}
