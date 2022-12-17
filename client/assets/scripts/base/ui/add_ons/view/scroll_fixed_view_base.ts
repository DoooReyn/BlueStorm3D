import { Node, _decorator, NodePool, UITransform, Event } from "cc";
import { range, removeDuplicated, sortByDescending } from "../../../func/arrays";
import { AutomaticBooleanValue } from "../../../func/automatic_value";
import { PrefabFactory } from "../../../res/prefab_factory";
import { Gossip } from "../gossip";
import { ScrollHorizontalView } from "./scroll_horizontal_view";
import { ScrollVerticalView } from "./scroll_vertical_view";
import { getUiTransformOf, getWorldBoundindBoxOf, TimeOfPerFrame } from "../ui_helper";
import { Singletons } from "../../../singletons";
import { ScrollViewBase } from "./scroll_view_base";
import { deepClone } from "../../../func/utils";
import { ContainerFactory } from "./container_factory";
import { E_Container_Event, ViewItemEvent } from "./container_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/scroll_fixed_view_base.ts
 * Author   : reyn
 * Date     : Thu Dec 15 2022 17:48:22 GMT+0800 (中国标准时间)
 * Class    : ScrollFixedViewBase
 * Desc     : 使用固定模板的滚动视图基类
 */
@ccclass("scroll_fixed_view_base")
export abstract class ScrollFixedViewBase<T, V extends ScrollHorizontalView | ScrollVerticalView> extends Gossip {
    // REGION START <Member Variables>

    @property({ displayName: "滚动视图", type: ScrollViewBase })
    view: V = null;

    @property({ displayName: "模板预制体路径" })
    protected templatePath: string = "";

    @property({ displayName: "模板预制体所属资源包" })
    protected templateBundle: string = "resources";

    /**
     * 容器/预制体工厂
     */
    private _factory: ContainerFactory = null;

    /**
     * 数据列表
     */
    private _data: T[] = [];

    /**
     * 视图子项变化脏标记
     */
    private _viewDirty: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    /**
     * 视图自纠脏标记
     */
    private _viewSizeDirty: AutomaticBooleanValue = new AutomaticBooleanValue(false);

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onEnable() {
        this.node.on(ScrollViewBase.EVENT_SCOLLING, this._setViewDirtyImmediately, this);
        this.node.on(ScrollViewBase.EVENT_ITEM_REMOVE_FROM_VIEW, this._onItemRemove, this);
    }

    protected onDisable() {
        this.node.off(ScrollViewBase.EVENT_SCOLLING, this._setViewDirtyImmediately, this);
        this.node.off(ScrollViewBase.EVENT_ITEM_REMOVE_FROM_VIEW, this._onItemRemove, this);
        this.unscheduleAllCallbacks();
    }

    protected start() {
        PrefabFactory.create({ path: this.templatePath, bundle: this.templateBundle }).then((factory) => {
            factory.preload(this.view.getPreloadCount(factory.getItemSize()));
            this._factory = new ContainerFactory(factory);
            this._onPreloaded();
        });
    }

    protected onDestroy() {
        this._factory.clearAll();
    }

    /**
     * 容器/预制体预加载完成回调
     */
    protected abstract _onPreloaded(): void;

    /**
     * 前置更新
     */
    protected update(_: number) {
        this._refreshView();
    }

    /**
     * 后置更新
     */
    protected lateUpdate(_: number) {
        this._lateRefreshView();
    }

    /**
     * 子项移除事件
     * @param event 视图子项发送的事件
     */
    protected _onItemRemove(event: ViewItemEvent) {
        event.propagationStopped = true;
        this.removeItem(event.index);
    }

    /**
     * 在下一帧设置脏标记
     */
    protected _setViewDirtyInNextFrame() {
        this.scheduleOnce(() => {
            this._viewDirty.set();
            this._viewSizeDirty.set();
        }, 0);
    }

    /**
     * 立即设置脏标记
     */
    protected _setViewDirtyImmediately() {
        this._viewDirty.set();
    }

    /**
     * 前置刷新视图
     * - 视图子项的复用在此完成
     */
    protected _refreshView() {
        if (this._viewDirty.isset()) {
            this._viewDirty.unset();

            const items = this.view.contentNode.children;
            if (items.length === 0) return;

            const m_box = getWorldBoundindBoxOf(this.view.maskNode, this.view.maskNode);
            let start = -1,
                ended = -1;
            items.forEach((item, i) => {
                if (!item.active) {
                    return;
                }

                if (ended > -1) {
                    item.emit(E_Container_Event.ItemHide, i);
                    return;
                }

                let t_box = getWorldBoundindBoxOf(item, this.view.maskNode);
                let intersects = m_box.intersects(t_box);
                if (intersects) {
                    start === -1 && (start = i);
                    item.emit(E_Container_Event.ItemShow, i, this._data[i]);
                } else {
                    start > -1 && ended === -1 && (ended = i);
                    item.emit(E_Container_Event.ItemHide, i);
                }
            });
        }
    }

    /**
     * 后置刷新视图
     * - 子项数量变化会造成容器尺寸变化，此时需要刷新视图以适应尺寸变化
     */
    protected _lateRefreshView() {
        if (this._viewSizeDirty.isset()) {
            this._viewSizeDirty.unset();

            const items = this.view.contentNode.children;
            if (items.length === 0) return;

            this.view.refreshView();
        }
    }

    /**
     * 删除指定索引上的子项
     * @param index 指定索引
     */
    protected _removeChild(index: number) {
        let container = this.view.contentNode.children[index];
        container && this._factory.putContainer(container);
    }

    /**
     * 添加子项
     */
    protected _appendChild() {
        this.view.contentNode.addChild(this._factory.getContainer());
    }

    /**
     * 添加多个子项
     * @param num
     * @returns
     */
    protected _appendMany(num: number) {
        if (num <= 0) return;

        let count = 0;
        const self = this;
        function _appendItem() {
            count++;
            if (count > num) {
                return self.unschedule(_appendItem);
            }
            self._appendChild();
            self._setViewDirtyInNextFrame();
        }
        this.schedule(_appendItem, TimeOfPerFrame);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 从末尾添加子项
     * @param data 数据
     */
    public pushItem(data: T) {
        this._data.push(data);
        this._appendChild();
        this._setViewDirtyInNextFrame();
    }

    /**
     * 从末尾添加多个子项
     * @param data
     * @returns
     */
    public pushItems(data: T[]) {
        const target = data.length;
        if (target === 0) return;

        this._data.push(...data);
        this._appendMany(target);
    }

    /**
     * 从末尾删除子项
     */
    public popItem() {
        const count = this.view.contentNode.children.length;
        if (count > 0) {
            const container = this.view.contentNode.children[count - 1];
            this._factory.putContainer(container);
            this._data.pop();
            this._setViewDirtyInNextFrame();
        }
    }

    /**
     * 从末尾删除多个子项
     */
    public popItems(num: number) {
        num = num | 0;
        if (num <= 0) return;

        const count = this._data.length;
        num = Math.min(num, count);
        this.removeItems(range(count - num, count - 1, -1));
    }

    /**
     * 从指定索引插入子项
     * @param index 索引
     * @param data 数据
     */
    public insertItem(index: number, data: T) {
        index = index | 0;
        if (index >= 0) {
            this._data.splice(index, 0, data);
            this._appendChild();
            this._setViewDirtyInNextFrame();
        }
    }

    /**
     * 从指定索引插入多个子项
     * @param index 索引
     * @param data 数据列表
     */
    public insertItems(index: number, data: T[]) {
        index = index | 0;
        const target = data.length;
        if (index >= 0 && target > 0) {
            this._data.splice(index, 0, ...data);
            this._appendMany(target);
        }
    }

    /**
     * 删除指定索引项
     * @param index 索引
     */
    public removeItem(index: number) {
        index = index | 0;
        if (index >= 0 && index < this._data.length) {
            this._data.splice(index, 1);
            this._removeChild(index);
            this._setViewDirtyInNextFrame();
        }
    }

    /**
     * 删除多个子项
     * @param indexArr 索引数组
     */
    public removeItems(indexArr: number[]) {
        const filters = indexArr.filter((v) => v === (v | 0) && v >= 0 && v < this._data.length);
        const sorted = sortByDescending(removeDuplicated(filters));
        if (sorted.length > 0) {
            sorted.forEach((index) => {
                this._data.splice(index, 1);
                this._removeChild(index);
            });
            this._setViewDirtyInNextFrame();
        }
    }

    /**
     * 删除全部子项
     */
    public removeAllItems() {
        this.removeItems(range(0, this._data.length - 1, -1));
    }

    /**
     * 重新载入数据
     * @param data 全部数据
     */
    public reload(data: any[]) {
        const before = this._data.length;
        const after = data.length;
        if (after < before) {
            this.removeItems(range(after, before - 1, -1));
            this._data = deepClone(data);
        } else if (after > before) {
            this._data = deepClone(data);
            this._appendMany(after - before);
        }
    }

    // REGION ENDED <public>
}
