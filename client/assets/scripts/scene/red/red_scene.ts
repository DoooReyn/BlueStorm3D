import { _decorator, Component, NodeEventType } from "cc";
import { Singletons } from "../../base/singletons";
import RedDot from "./red_dot";
import RedDotNumber from "./red_dot_number";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/red/red_scene.ts
 * Author   : reyn
 * Date     : Wed Nov 30 2022 23:16:29 GMT+0800 (中国标准时间)
 * Class    : RedScene
 * Desc     :
 */
@ccclass("RedScene")
export class RedScene extends Component {
    @property(RedDot)
    menu: RedDot = null;

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
        Singletons.red.init();
    }

    onDestroy() {}

    onEnable() {
        this.mailSystem.node.on(NodeEventType.TOUCH_END, () => {
            Singletons.red.root.seek("Mail/System").count--;
        });
        this.mailPrivate.node.on(NodeEventType.TOUCH_END, () => {
            Singletons.red.root.seek("Mail/Private").count--;
        });
    }

    onDisable() {}

    start() {
        Singletons.red.root.connect(this.menu);
        Singletons.red.root.seek("Mail").connect(this.mail);
        Singletons.red.root.seek("Mail/System").connect(this.mailSystem);
        Singletons.red.root.seek("Mail/Private").connect(this.mailPrivate);
    }

    // update(dt: number) {}

    // lateUpdate(dt: number) {}
}
