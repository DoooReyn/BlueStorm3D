import { _decorator, Event } from "cc";
import { Gossip } from "../gossip";
import { getUiTransformOf } from "../ui_helper";
import { ContainerFactory } from "./container_factory";
const { ccclass } = _decorator;

/**
 * 容器事件类型
 */
export enum E_Container_Event {
    ItemSizeChanged = "item-size-changed",
    ItemShow = "item-show",
    ItemHide = "item-hide",
}

/**
 * 视图子项事件
 */
export class ViewItemEvent extends Event {
    /**
     * 子项在视图中的索引
     */
    public index: number = -1;

    constructor(type: string, index: number, bubbles: boolean = true) {
        super(type, bubbles);
        this.index = index;
    }
}

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/container_base.ts
 * Author   : reyn
 * Date     : Sat Dec 17 2022 09:48:57 GMT+0800 (中国标准时间)
 * Class    : ContainerBase
 * Desc     : 容器组件
 */
@ccclass("container_base")
export class Container<T> extends Gossip {
    /**
     * 容器在视图中的索引
     */
    private _index: number = -1;

    /**
     * 容器工厂
     */
    private _factory: ContainerFactory = null;

    protected onEnable() {
        this.node.on(E_Container_Event.ItemSizeChanged, this._syncContentSizeForItem, this);
        this.node.on(E_Container_Event.ItemShow, this._onItemShow, this);
        this.node.on(E_Container_Event.ItemHide, this._onItemHide, this);
    }

    protected onDisable() {
        this._index = -1;
        this.node.off(E_Container_Event.ItemSizeChanged, this._syncContentSizeForItem, this);
        this.node.on(E_Container_Event.ItemShow, this._onItemShow, this);
        this.node.on(E_Container_Event.ItemHide, this._onItemHide, this);
    }

    /**
     * 与容器子项的尺寸保持一致
     */
    protected _syncContentSizeForItem() {
        let item = this.node.children[0];
        getUiTransformOf(this.node).setContentSize(getUiTransformOf(item).contentSize);
    }

    /**
     * 容器显示
     * @param data 数据
     */
    protected _onItemShow(index: number, data: T) {
        this.index = index;
        const count = this.node.children.length;
        count === 0 && this.node.addChild(this._factory.getItem());
        this.node.children[0].emit(E_Container_Event.ItemShow, this._index, data);
    }

    /**
     * 容器隐藏
     */
    protected _onItemHide(index: number) {
        this.index = index;
        const count = this.node.children.length;
        count > 0 && this.node.children[0].emit(E_Container_Event.ItemHide, index);
        this._factory.putItem(this.node);
    }

    /**
     * 设置容器工厂
     * @param factory 容器工厂
     */
    public setFactory(factory: ContainerFactory) {
        this._factory = factory;
    }

    /**
     * 设置容器在视图中的索引
     */
    public set index(index: number) {
        this._index = index;
    }

    /**
     * 获取容器在视图中的索引
     */
    public get index() {
        return this._index;
    }
}
