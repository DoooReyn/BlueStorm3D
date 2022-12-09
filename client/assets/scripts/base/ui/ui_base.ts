import { _decorator, Component, Enum, EventTouch, Event, BlockInputEvents } from "cc";
import { runInSandbox } from "../func/utils";
import { Singletons } from "../singletons";
import { Gossip } from "./add_ons/gossip";
const { ccclass, property, disallowMultiple, requireComponent } = _decorator;

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
    OPEN_AGAIN = "ui-open-again",
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
@ccclass("ui_base")
@disallowMultiple(true)
export abstract class UiBase extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "UI类型", type: CE_UI_Type })
    uiType = CE_UI_Type.Screen;

    @property({ displayName: "常驻内存" })
    persist: boolean = true;

    /**
     * 资源信息
     */
    protected _uiInfo: I_UiInfo = null;

    /**
     * 关闭回调列表
     */
    protected _closeHandlers: Function[] = [];

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(E_Ui_Event.OPEN_AGAIN, this.onOpenAgain, this);
    }

    protected onDisable() {
        this.node.off(E_Ui_Event.OPEN_AGAIN, this.onOpenAgain, this);
    }

    /**
     * Ui 重入
     * @virtual 按需重写此方法
     */
    protected onOpenAgain() {}

    /**
     * 点击关闭按钮触发关闭
     * @virtual 按需重写此方法
     * @param _ 点击事件
     * @param type 携带参数
     */
    protected onCloseBtnTriggered(_: EventTouch, type: string) {
        this.playClose({ from: "Button.Close", type });
    }

    /**
     * 关闭 Ui
     * - 不允许在外部调用
     */
    protected close(): void {
        this._closeHandlers.forEach((r) => runInSandbox({ onExcute: r }));
        this._closeHandlers.length = 0;
        this.node.parent.emit(E_Ui_Event.REMOVE, this);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 设置资源信息
     * @param info 资源信息
     */
    public setUiInfo(info: I_UiInfo) {
        this._uiInfo = Object.assign({}, info);
    }

    /**
     * 是否同一个Ui
     * @param info 资源信息
     * @returns
     */
    public isTheSameUiInfo(info: I_UiInfo) {
        return this._uiInfo.path === info.path && this._uiInfo.bundle === info.bundle;
    }

    /**
     * 播放打开动画
     * @param args 参数列表
     */
    public playOpen(...args: any[]) {
        Singletons.log.i(`[${this.node.name}] 播放打开动画: `, args);
    }

    /**
     * 播放关闭动画
     * @param args 参数列表
     */
    public playClose(...args: any[]) {
        Singletons.log.i(`[${this.node.name}] 播放关闭动画: `, args);
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

    // REGION ENDED <protected>
}
