import { _decorator, Node, NodePool, UITransform } from "cc";
import { PrefabFactory } from "../../../res/prefab_factory";
import { Singletons } from "../../../singletons";
import { Container } from "./container_base";

/**
 * Url      : db://assets/scripts/base/ui/add_ons/view/container_factory.ts
 * Author   : reyn
 * Date     : Sat Dec 17 2022 09:46:09 GMT+0800 (中国标准时间)
 * Class    : ContainerFactory
 * Desc     : 容器工厂
 */
export class ContainerFactory extends NodePool {
    /**
     * 预制体工厂
     */
    private _factory: PrefabFactory = null;

    /**
     * 创建容器节点
     * @returns
     */
    protected _createNode() {
        let node = new Node("Container");
        let container = node.addComponent(Container);
        container.setFactory(this);
        let cui = node.addComponent(UITransform);
        cui.setAnchorPoint(0.5, 0.5);
        cui.setContentSize(this._factory.getItemSize());
        return node;
    }

    /**
     * 预加载
     * @param n 预加载数量
     */
    protected _preload(n: number) {
        for (let i = 0; i < n; i++) {
            this.put(this._createNode());
        }
    }

    /**
     * 构造器
     * @param factory 子项节点工厂
     */
    public constructor(factory: PrefabFactory) {
        super();
        this._factory = factory;
        this._preload(factory.preloadSize);
    }

    /**
     * 获取容器节点
     * @returns
     */
    public getContainer(): Node {
        let node = undefined;
        if (this.size() > 0) {
            node = this.get();
        } else {
            node = this._createNode();
        }
        this.dumpSize();
        return node;
    }

    /**
     * 回收容器节点
     * @param node 容器节点
     * @returns
     */
    public putContainer(node: Node) {
        let container = node.getComponent(Container);
        if (!container) return;

        let item = node.children[0];
        item && this._factory.putItem(item);
        node.targetOff(container);
        node.getComponent(UITransform).setContentSize(this._factory.getItemSize());
        this.put(node);
        this.dumpSize();
    }

    /**
     * 输出当前对象池持有对象数量
     */
    public dumpSize() {
        Singletons.log.i(`[容器对象池] <${this._factory.name}>: ${this.size()}`);
    }

    /**
     * 获取子项节点
     * @returns
     */
    public getItem() {
        return this._factory.getItem();
    }

    /**
     * 回收子项节点
     * @param node 容器节点
     * @returns
     */
    public putItem(node: Node) {
        let container = node.getComponent(Container);
        if (!container) return;

        let item = node.children[0];
        item && this._factory.putItem(item);
    }

    /**
     * 清空对象池
     */
    public clearAll() {
        this._factory.clearAll();
        this.clear();
    }
}
