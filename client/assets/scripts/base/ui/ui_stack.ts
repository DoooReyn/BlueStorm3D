import { _decorator, Component, Prefab, UI } from "cc";
import { Singletons } from "../singletons";
import { E_Ui_Event, E_UI_Type, I_UiInfo, UiBase, UiEvent } from "./ui_base";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_stack.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:12:27 GMT+0800 (中国标准时间)
 * Class    : UiStack
 * Desc     : Ui栈
 *      - 规定 Ui 栈只能按顺序添加和移除
 *      - 除非使用 replace 强行清空栈并压入新的 Ui
 */
@ccclass("UiStack")
export abstract class UiStack extends Component {
    /**
     * Ui 栈
     */
    protected _stack: Array<UiBase> = [];

    protected onEnable() {
        this.node.on(E_Ui_Event.REMOVE, this.removeUi, this);
    }

    protected onDisable() {
        this.node.off(E_Ui_Event.REMOVE, this.removeUi, this);
    }

    /**
     * Ui 栈深度
     */
    public get depth() {
        return this._stack.length;
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
     * 打开页面
     * @param info 资源信息
     * @param args 参数列表
     */
    public async open<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        info.bundle = info.bundle || "resources";
        let uiIndex = this.seekUiIndexByUiInfo(info);
        if (uiIndex > -1) {
            if (uiIndex < this.depth - 1) {
                return this.onOpenOther<T>(uiIndex);
            } else {
                return this.onOpenAgain<T>(uiIndex);
            }
        }

        if (!this.isOpenAllowed()) {
            Singletons.log.e(`[${this.name}] 打开Ui失败,已达到栈极限: ${info.bundle}/${info.path}`);
            return this.onOpenLimit<T>(info, ...args);
        }

        let prefab = await Singletons.drm.load<Prefab>(info.path, Prefab, info.bundle);
        if (!prefab) {
            Singletons.log.e(`[${this.name}] 打开Ui失败,无法加载资源: ${info.bundle}/${info.path}`);
            return Promise.resolve(null);
        }

        let node = Singletons.drm.useNode(prefab);
        let ui = node.getComponent("UiBase") as T;
        ui.setUiInfo(info);
        ui.persist && prefab.refCount <= 1 && Singletons.drm.addRef(prefab);
        this.addToStack(ui);
        this.node.addChild(node);
        ui.playOpen(...args);
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
        this.open(info, ...args);
    }

    /**
     * 关闭页面
     * @param info 资源信息
     * @param args 参数列表
     */
    public close(info: I_UiInfo, ...args: any[]) {
        let uiIndex = this.seekUiIndexByUiInfo(info);
        if (uiIndex > -1) {
            if (uiIndex < this.depth - 1) {
                return this.onCloseOther(uiIndex);
            } else {
                this.getUi(uiIndex).playClose(...args);
            }
        } else {
            Singletons.log.e(`[${this.name}] 关闭Ui失败,可能未打开: ${info?.bundle}/${info.path}`);
        }
    }

    public isStackedUi(ui: UiBase) {
        return this.getUiIndex(ui) > -1;
    }

    protected getUiIndex(ui: UiBase) {
        return this._stack.indexOf(ui);
    }

    /**
     * 删除并释放 Ui
     * - // 谨慎——删除并释放Ui
     * @param ui Ui 组件
     */
    public removeUi(ui: UiBase) {
        let uiIndex = this.getUiIndex(ui);
        if (uiIndex > -1) {
            this.removeFromStack(uiIndex);
            Singletons.drm.decRef((<any>ui.node)._prefab.asset);
            ui.node.removeFromParent();
            ui.node.destroy();
        }
    }

    /**
     * 关闭除占地页面外的所有页面
     */
    public closeToRoot() {
        for (let i = this.depth - 1; i > 0; i--) {
            this.removeUi(this.getUi(i));
        }
        if (this.depth >= 1) {
            this._stack.length = 1;
        }
    }

    /**
     * 关闭所有页面
     */
    public closeAll() {
        for (let i = this.depth - 1; i >= 0; i--) {
            this.removeUi(this.getUi(i));
        }
        this._stack.length = 0;
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
     * 触及限制时打开 Ui
     * @param info 资源信息
     * @param args 参数列表
     * @virtual 按需重写此方法
     */
    protected async onOpenLimit<T extends UiBase>(info: I_UiInfo, ...args: any[]): Promise<T | null> {
        return Promise.resolve(null);
    }

    /**
     * 打开前置 Ui
     * @virtual 按需重写此方法
     * @param index index 索引
     */
    protected async onOpenOther<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.log.i(`[${this.name}] 打开前置 Ui: ${index}`, this.getUi(index));
        return Promise.resolve(null);
    }

    /**
     * 再次打开 Ui
     * @virtual 按需重写此方法
     * @param index index 索引
     */
    protected async onOpenAgain<T extends UiBase>(index: number): Promise<T | null> {
        Singletons.log.i(`[${this.name}] 再次打开 Ui: ${index}`, this.getUi(index));
        return Promise.resolve(null);
    }

    /**
     * 关闭前置 Ui
     * @virtual 按需重写此方法
     * @param index index 索引
     */
    protected onCloseOther(index: number) {
        Singletons.log.i(`[${this.name}] 关闭前置 Ui: ${index}`, this.getUi(index));
    }
}
