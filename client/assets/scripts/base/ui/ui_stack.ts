import { _decorator, Component, Prefab } from "cc";
import { Singletons } from "../singletons";
import { Gossip } from "./add_ons/gossip";
import { setupDefaultBundle } from "./add_ons/ui_helper";
import { E_Ui_Event, I_UiInfo, UiBase } from "./ui_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_stack.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:27 GMT+0800 (中国标准时间)
 * Class    : UiStack
 * Desc     : Ui栈
 * - 规定 Ui 栈只能按顺序添加
 * - 添加 Ui 只能通过 `open` 方法
 * - 移除 Ui 可以使用 `close/closeToIndex/closeToRoot/closeAll/replace`
 * - 移除 Ui 时，实际 Ui 节点并不直接实行删除操作，而是通过发送事件给栈（父亲）节点，让栈节点去处理
 * - 继承时考虑是否需要重写以下几个方法：
 *      - `isOpenAllowed` —— 是否有栈深度限制，即栈的容纳数量？
 *      - `onOpenWhenReachStatckLimit` —— 当达到栈深度限制时，要怎么处理？
 *      - `onOpenBefore` —— 打开页面之前（Ui预制体已加载，但节点未添加到渲染树）可以做点什么？
 *      - `onOpenAfter` —— 打开页面之后（Ui节点已添加到渲染树）可以做点什么？
 *      - `onOpenCurrent` —— 当前页面被重复打开时，要怎么处理？
 *      - `onOpenPrevious` —— 前置页面被重复打开时，要怎么处理？
 *      - `onClosePrevious` —— 前置页面被关闭时，要怎么处理？
 *      - `onShowLoading` —— 打开页面之前是否需要显示 Loading？
 *      - `onHideLoading` —— 打开页面之后是否需要关闭 Loading？
 */
@ccclass("ui_stack")
export abstract class UiStack extends Gossip {
    // REGION START <Member Variables>

    /**
     * Ui 栈
     */
    protected _stack: Array<UiBase> = [];

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(E_Ui_Event.REMOVE, this.removeUi, this);
    }

    protected onDisable() {
        this.node.off(E_Ui_Event.REMOVE, this.removeUi, this);
    }

    /**
     * 获得指定索引位置的 Ui 组件
     * @param index 索引
     * @returns
     */
    protected getUi(index: number) {
        if (index > -1) return this._stack[index];
    }

    /**
     * 获取Ui在栈中的索引
     * @param ui Ui组件
     * @returns
     */
    protected getUiIndex(ui: UiBase) {
        return this._stack.indexOf(ui);
    }

    /**
     * 删除并释放 Ui
     * @param ui Ui 组件
     */
    protected removeUi(ui: UiBase) {
        let uiIndex = this.getUiIndex(ui);
        if (uiIndex > -1) {
            this.removeFromStack(uiIndex);
            Singletons.drm.decRef((<any>ui.node)._prefab.asset);
            ui.node.removeFromParent();
            ui.node.destroy();
        }
    }

    /**
     * 查找 Ui
     * @param info 资源信息
     * @returns
     */
    protected seekUiIndexByUiInfo(info: I_UiInfo) {
        return this._stack.findIndex((v) => v.isTheSameUiInfo(info));
    }

    /**
     * 添加 Ui
     * @param ui Ui 组件
     */
    protected addToStack(ui: UiBase) {
        this._stack.indexOf(ui) === -1 && this._stack.push(ui);
    }

    /**
     * 移除 Ui
     * @param index 索引
     */
    protected removeFromStack(index: number) {
        index > -1 && this._stack.splice(index, 1);
    }

    /**
     * 是否允许打开新页面
     * - 你需要在此检查打开新页面的条件
     * - 比如：是否符合限制深度
     * @virtual 必须重写此方法
     * @returns
     */
    protected abstract isOpenAllowed(): boolean;

    /**
     * 打开Ui之前
     * @param ui 当前 Ui 组件
     * @virtual 按需重写此方法
     */
    protected onOpenBefore(ui: UiBase) {}

    /**
     * 打开Ui之后
     * @virtual 按需重写此方法
     */
    protected onOpenAfter(ui: UiBase) {}

    /**
     * 触及栈深度限制时打开 Ui
     * @param info 资源信息
     * @param args 参数列表
     * @virtual 按需重写此方法
     */
    protected async onOpenWhenReachStatckLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        this.w(`打开Ui失败,已达到栈极限: ${info.bundle}/${info.path}`);
        return Promise.resolve(null);
    }

    /**
     * 打开前置 Ui
     * @virtual 按需重写此方法
     * @param index index 前置 Ui 所在的栈深度
     */
    protected async onOpenPrevious<T extends UiBase>(index: number): Promise<T | null> {
        let ui = this.getUi(index) as T;
        this.i(`打开前置 Ui: ${index}`);
        return Promise.resolve(ui);
    }

    /**
     * 已打开的情况下再次打开 Ui
     * @virtual 按需重写此方法
     * @param index index 当前 Ui 所在的栈深度
     */
    protected async onOpenCurrent<T extends UiBase>(index: number): Promise<T | null> {
        let ui = this.getUi(index) as T;
        this.i(`再次打开 Ui: ${index}`);
        ui.node.emit(E_Ui_Event.OPEN_AGAIN);
        return Promise.resolve(ui);
    }

    /**
     * 关闭前置 Ui
     * @virtual 按需重写此方法
     * @param index index 前置 Ui 所在的栈深度
     */
    protected onClosePrevious(index: number, ...args: any[]) {
        this.i(`关闭前置 Ui: ${index}`, ...args);
    }

    /**
     * 显示Ui资源加载 Loading
     */
    protected async onShowLoading() {}

    /**
     * 隐藏Ui资源加载 Loading
     */
    protected onHideLoading() {}
    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * Ui 栈深度
     */
    public get depth() {
        return this._stack.length;
    }

    /**
     * 打开页面
     * @param info 资源信息
     * @param args 参数列表
     */
    public async open<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        setupDefaultBundle(info);
        let uiIndex = this.seekUiIndexByUiInfo(info);
        if (uiIndex > -1) {
            if (uiIndex < this.depth - 1) {
                return this.onOpenPrevious<T>(uiIndex);
            } else {
                return this.onOpenCurrent<T>(uiIndex);
            }
        }

        if (!this.isOpenAllowed()) {
            return this.onOpenWhenReachStatckLimit<T>(info, ...args);
        }

        this.onShowLoading();
        let prefab = await Singletons.drm.load<Prefab>(info.path, Prefab, info.bundle);
        if (!prefab) {
            this.e(`打开Ui失败,无法加载资源: ${info.bundle}/${info.path}`);
            this.onHideLoading();
            return Promise.resolve(null);
        }
        this.onHideLoading();

        let node = Singletons.drm.useNode(prefab);
        let ui = node.getComponent("ui_base") as T;
        ui.persist && prefab.refCount <= 1 && Singletons.drm.addRef(prefab);
        ui.setUiInfo(info);
        this.onOpenBefore(ui);
        this.addToStack(ui);
        this.node.addChild(node);
        ui.playOpen(...args);
        this.onOpenAfter(ui);
        return Promise.resolve(ui);
    }

    /**
     * 使用新页面替换Ui栈，即只保留新页面
     * @param info
     * @param args
     * @returns
     */
    public async replace<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        let uiIndex = this.seekUiIndexByUiInfo(info);
        if (uiIndex === 0) {
            this.closeToRoot();
            return Promise.resolve(this.getUi(uiIndex) as T);
        }

        this.closeAll();
        return this.open(info, ...args);
    }

    /**
     * 关闭页面
     * @param info 资源信息
     * @param args 参数列表
     */
    public close(info: I_UiInfo, ...args: any[]) {
        setupDefaultBundle(info);
        let uiIndex = this.seekUiIndexByUiInfo(info);
        if (uiIndex > -1) {
            if (uiIndex < this.depth - 1) {
                this.onClosePrevious(uiIndex, ...args);
            } else {
                this.getUi(uiIndex).playClose(...args);
            }
        } else {
            this.e(`关闭Ui失败,可能未打开: ${info?.bundle}/${info.path}`);
        }
    }

    /**
     * Ui是否已打开
     * @param ui Ui组件
     * @returns
     */
    public isStackedUi(ui: UiBase) {
        return this.getUiIndex(ui) > -1;
    }

    /**
     * 依次倒序关闭页面，直到到达指定栈深度
     * @param index 指定深度
     */
    public closeToIndex(index: number) {
        index = index | 0;
        if (index >= 0 && index <= this.depth - 1) {
            for (let i = this.depth - 1; i > index; i--) {
                this.removeUi(this.getUi(i));
            }
        }
    }

    /**
     * 依次倒序关闭除栈底页面外的所有页面
     */
    public closeToRoot() {
        this.closeToIndex(0);
    }

    /**
     * 关闭所有页面
     */
    public closeAll() {
        for (let i = this.depth - 1; i >= 0; i--) {
            this.removeUi(this.getUi(i));
        }
    }

    // REGION ENDED <public>
}
