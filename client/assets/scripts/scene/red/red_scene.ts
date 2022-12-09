import { _decorator, Component, NodeEventType, EventTouch } from "cc";
import RedDotNumber from "../../base/red/red_dot_number";
import RedDotPure from "../../base/red/red_dot_pure";
import { Singletons } from "../../base/singletons";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/red/red_scene.ts
 * Author   : reyn
 * Date     : Wed Nov 30 2022 23:16:29 GMT+0800 (中国标准时间)
 * Class    : RedScene
 * Desc     : 红点测试场景
 */
@ccclass("red_scene")
export class RedScene extends Component {
    @property(RedDotPure)
    menu: RedDotPure = null;

    @property(RedDotNumber)
    mail: RedDotNumber = null;

    @property(RedDotNumber)
    mailSystem: RedDotNumber = null;

    @property(RedDotNumber)
    mailPrivate: RedDotNumber = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    onLoad() {
        Singletons.red;
    }

    onDestroy() {}

    onEnable() {
        this.mailSystem.node.on(NodeEventType.TOUCH_END, () => {
            Singletons.red.mail_system.addNumber(-1);
        });
        this.mailPrivate.node.on(NodeEventType.TOUCH_END, () => {
            Singletons.red.mail_private.addNumber(-1);
        });
    }

    onDisable() {}

    start() {
        Singletons.red.root_menu.connect(this.menu);
        Singletons.red.menu_mail.connect(this.mail);
        Singletons.red.mail_system.connect(this.mailSystem);
        Singletons.red.mail_private.connect(this.mailPrivate);
    }

    onBtnClicked(e: EventTouch, type: string) {
        switch (type) {
            case "AddSystem":
                Singletons.red.mail_system.addNumber(1);
                break;
            case "AddPrivate":
                Singletons.red.mail_private.addNumber(1);
                break;
        }
    }
}
