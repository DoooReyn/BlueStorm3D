import { _decorator, Component, Canvas, Prefab } from "cc";
import { Singletons } from "../singletons";
import { UiDialogs } from "./dialog/ui_dialogs";
import { UiLayers } from "./layer/ui_layers";
import { UiLoadings } from "./loading/ui_loadings";
import { UiScreens } from "./screen/ui_screens";
import { UiTips } from "./tip/ui_tips";
import { UiMap } from "./ui_map";
const { ccclass, requireComponent, property, disallowMultiple } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/adpative_canvas.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : UiMgr
 * Desc     : Ui管理器
 */
@ccclass("UiMgr")
@requireComponent(Canvas)
@disallowMultiple(true)
export class UiMgr extends Component {
    @property(UiScreens)
    screens: UiScreens = null;

    @property(UiLayers)
    layers: UiLayers = null;

    @property(UiDialogs)
    dialogs: UiDialogs = null;

    @property(UiLoadings)
    loadings: UiLoadings = null;

    @property(UiTips)
    tips: UiTips = null;

    onLoad() {
        Singletons.ui = this;
    }

    start() {
        Singletons.drm.load(UiMap.DefaultLoading.path, Prefab, UiMap.DefaultLoading.bundle).then(() => {
            Singletons.ui.screens.open(UiMap.HomeScreen);
        });
    }
}
