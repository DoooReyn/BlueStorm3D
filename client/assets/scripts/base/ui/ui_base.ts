import { _decorator, Component, Enum, EventTouch, Event, tweenUtil } from "cc";
import { runInSandbox } from "../func/utils";
import { Singletons } from "../singletons";
const { ccclass, property, disallowMultiple } = _decorator;

/**
 * UI 类型
 * - Screen     一级界面<同时有且只有一个>
 * - Layer      二级界面<同时有且只有一个>
 * - Dialog     弹窗页面<同时可以存在多个>
 * - Loading    加载页面<同时有且只有一个>
 * - Tip        提示页面<同时可以存在多个，例如：消息提示/网络状态>
 */
export enum E_UI_Type {
    Screen = 0,
    Layer,
    Dialog,
    Loading,
    Tip,
}
export const CE_UI_Type = Enum({
    Screen: 0,
    Layer: 1,
    Dialog: 2,
    Loading: 3,
    Tip: 4,
});

/**
 * Ui 资源信息
 * - path   资源路径
 * - bundle 资源隶属的包
 */
export interface I_UiInfo {
    path: string;
    bundle?: string;
}

/**
 * Ui 事件类型
 */
export enum E_Ui_Event {
    REMOVE = "ui-removed",
}

/**
 * Ui 事件
 */
export class UiEvent extends Event {
    public ui: UiBase = null;

    constructor(type: E_Ui_Event, ui: UiBase) {
        super(type, true);
        this.ui = ui;
    }
}

/**
 * Url      : db://assets/scripts/base/ui/ui_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : UiBase
 * Desc     : Ui基类
 */
@ccclass("UiBase")
@disallowMultiple(true)
export abstract class UiBase extends Component {
    @property({ displayName: "UI类型", type: CE_UI_Type })
    uiType = CE_UI_Type.Screen;

    @property({ displayName: "常驻内存" })
    persist: boolean = true;

    protected _uiInfo: I_UiInfo = null;
    protected _closeHandlers: Function[] = [];

    start() {
        if (this.persist) {
            Singletons.drm.addRef((<any>this.node)._prefab.asset);
        }
    }

    public setUiInfo(info: I_UiInfo) {
        this._uiInfo = Object.assign({}, info);
    }

    public isTheSameUiInfo(info: I_UiInfo) {
        return this._uiInfo.path === info.path && this._uiInfo.bundle === info.bundle;
    }

    /**
     * 点击关闭按钮触发关闭
     * @param _ 点击事件
     * @param type 携带参数
     */
    public onCloseBtnTriggered(_: EventTouch, type: string) {
        this.playClose({ from: "Button.Close", type });
    }

    /**
     * 播放打开动画
     * @param args 参数列表
     */
    public playOpen(...args: any[]) {
        Singletons.log.i(`[${this.name}] 播放打开动画: `, args);
    }

    /**
     * 播放关闭动画
     * @param args 参数列表
     */
    public playClose(...args: any[]) {
        Singletons.log.i(`[${this.name}] 播放关闭动画: `, args);
        this.close();
    }

    /**
     * 添加关闭回调
     * @param f 关闭回调
     */
    public addCloseHandler(f: Function) {
        if (this._closeHandlers.indexOf(f) === -1) {
            this._closeHandlers.push(f);
        }
    }

    /**
     * 关闭 Ui
     */
    public close(): void {
        this._closeHandlers.forEach((r) => runInSandbox({ onExcute: r }));
        this._closeHandlers.length = 0;
        this.node.parent.emit(E_Ui_Event.REMOVE, this);
    }
}
