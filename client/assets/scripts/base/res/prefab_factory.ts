import { _decorator, NodePool, Prefab, Node, UITransform, instantiate } from "cc";
import { Singletons } from "../singletons";
import { I_ResInfo } from "./res_info";

/**
 * Url      : db://assets/scripts/base/res/prefab_factory.ts
 * Author   : reyn
 * Date     : Thu Dec 15 2022 16:26:28 GMT+0800 (中国标准时间)
 * Class    : PrefabFactory
 * Desc     : 预制体生产工厂
 */
export class PrefabFactory {
    // REGION START <Member Variables>

    /**
     * 对象池
     */
    private _pool: NodePool = null;

    /**
     * 资源信息
     */
    private _info: I_ResInfo = null;

    /**
     * 预制体资源
     */
    private _prefab: Prefab = null;

    /**
     * 预加载完成否
     */
    private _preloaded: boolean = false;

    /**
     * 预加载数量
     */
    private _preloadNum: number = 0;

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    private constructor(info: I_ResInfo, prefab: Prefab, poolHandlerComp?: string) {
        Singletons.drm.addRef(prefab);
        this._info = Object.assign(info);
        this._prefab = prefab;
        this._pool = new NodePool(poolHandlerComp || prefab.data.name);
    }

    /**
     * 获取节点
     * @returns
     */
    protected _get() {
        return instantiate(this._prefab);
    }

    // REGION ENDED <protected>

    // REGION START <public>

    /**
     * 创建预制体工厂
     * @param info 资源信息
     * @returns
     */
    public static async create(info: I_ResInfo, poolHandlerComp?: string) {
        const asset = await Singletons.drm.load<Prefab>(info, Prefab);
        if (asset) {
            return new PrefabFactory(info, asset, poolHandlerComp);
        } else {
            throw new Error(`[PrefabFactory] Invalid prefab: ${info.bundle}/${info.path}`);
        }
    }

    /**
     * 预填充
     */
    public preload(count: number = 8) {
        if (this._preloaded || count <= 0) return;
        count = count | 0;
        this._preloaded = true;
        this._preloadNum = count;
        for (let i = 0; i < count; i++) {
            this._pool.put(this._get());
        }
    }

    /**
     * 预填充数量
     */
    public get preloadSize() {
        return this._preloadNum;
    }

    /**
     * 输出当前对象池持有对象数量
     */
    public dumpSize() {
        Singletons.log.i(`[预制体对象池] <${this.name}>: ${this._pool.size()}`);
    }

    /**
     * 获取节点
     * @returns
     */
    public getItem(): Node {
        let node = undefined;
        if (this._pool.size() > 0) {
            node = this._pool.get();
        } else {
            node = this._get();
        }
        this.dumpSize();
        return node;
    }

    /**
     * 返还节点
     */
    public putItem(node: Node) {
        this._pool.put(node);
        this.dumpSize();
    }

    /**
     * 获取预制体默认尺寸
     * @returns
     */
    public getItemSize() {
        return (this._prefab.data.getComponent(UITransform) as UITransform).contentSize;
    }

    /**
     * 获取预制体默认名称
     */
    public get name() {
        return this._prefab.data.name;
    }

    /**
     * 清空对象池
     */
    public clearAll() {
        this._pool.clear();
        Singletons.drm.decRef(this._prefab);
        Singletons.log.i(`[预制体对象池] <${this.name}>: clearAll ${this._prefab.refCount}`);
    }

    // REGION ENDED <public>
}
