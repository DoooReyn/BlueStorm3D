import { _decorator, Component, EventTouch } from "cc";
import { MyEventTouch } from "./my_event_touch";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/scene/event/event_scene.ts
 * Author   : reyn
 * Date     : Wed Nov 30 2022 13:45:55 GMT+0800 (中国标准时间)
 * Class    : EventScene
 * Desc     : 事件管理测试
 */
@ccclass("EventScene")
export class EventScene extends Component {
    @property(MyEventTouch)
    red: MyEventTouch = null;

    @property(MyEventTouch)
    green: MyEventTouch = null;

    /************************************************************
     * 基础事件
     ************************************************************/

    onBtnClicked(e: EventTouch, type: string) {
        switch (type) {
            case "0":
            case "1":
            case "2":
                const et = parseInt(type);
                this.red.setTouchEventType(et);
                this.green.setTouchEventType(et);
                break;
        }
    }
}
