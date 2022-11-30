import { EventTarget, game, Input, input } from "cc";

export class EventBus {
    // 用于网络消息的事件对象
    public net: EventTarget = new EventTarget();

    // 用于多语言的消息对象
    public i18n: EventTarget = new EventTarget();

    // 用于红点通知的事件对象
    public red: EventTarget = new EventTarget();

    // 用于动画帧事件的事件对象
    public animation: EventTarget = new EventTarget();

    // 用于用户自定义的事件对象
    public user: EventTarget = new EventTarget();

    // 用于游戏驱动的事件对象
    public system: EventTarget = game;

    // 用于系统设备的事件对象 <触摸、鼠标、加速计、游戏手柄、6DOF手柄、头戴显示器和键盘>
    public input: Input = input;
}
