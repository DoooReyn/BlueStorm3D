/**
 * Url      : db://assets/scripts/base/res/res_mgr.ts
 * Author   : reyn
 * Date     : Sat Dec 03 2022 16:18:16 GMT+0800 (中国标准时间)
 * Desc     : 动态资源管理器
 */
import {
    Asset,
    assetManager,
    AssetManager,
    instantiate,
    Node,
    Prefab,
    Sprite,
    SpriteAtlas,
    SpriteFrame,
    Texture2D,
    UIRenderer,
} from "cc";
import { T_LoadHandler } from "../func/utils";
import { Singletons } from "../singletons";
import SingletonBase from "../singleton_base";

/**
 * 缓存资源
 */
export interface I_CacheData {
    asset: Asset;
    type: typeof Asset;
    bundle: string;
}

/**
 * 动态资源管理器
 * - 目前已支持
 *  - SpriteFrame
 *  - SpriteAtlas
 *  - Prefab
 */
export class DynamicResMgr extends SingletonBase {
    /**
     * 缓存资源映射表
     */
    private _cache: Map<string, I_CacheData> = new Map();

    protected onInitialize(...args: any[]): void {
        this._cache.clear();
    }

    protected onDestroy(): void {
        this.removeAll();
    }

    /**
     * 获取资源真实路径
     * - 由于 SpriteFrame/Texture2D 路径需要添加后缀，故需要此方法来修正
     * @param path 资源原始路径
     * @param type 资源类型
     * @returns
     */
    private _realPath(path: string, type: typeof Asset) {
        if (type === SpriteFrame) {
            path += "/spriteFrame";
        } else if (type === Texture2D) {
            path += "/texture";
        }
        return path;
    }

    /**
     * 资源预加载
     * @param path 资源路径
     * @param type 资源类型
     * @param bundleNameOrUrl 资源包名称或地址
     * @param handler 资源加载回调
     */
    public loadInProgress<T extends Asset>(
        path: string | string[],
        type: typeof Asset,
        bundleNameOrUrl: string = "resources",
        preload: boolean = false,
        handler?: T_LoadHandler
    ) {
        this.loadBundle(bundleNameOrUrl).then((bundle) => {
            if (!bundle) {
                Singletons.log.e(`[DRM] cant find bundle: ${bundleNameOrUrl}`);
                handler?.bad();
                return;
            }

            !Array.isArray(path) && (path = [path]);
            path = path.map((v) => this._realPath(v, type));

            let loadFn = (preload ? bundle.preload : bundle.load).bind(bundle);
            loadFn(
                path,
                type,
                (finished: number, total: number) => handler?.progress(finished, total),
                (err: Error, items: AssetManager.RequestItem[] | T[]) => {
                    if (err) {
                        Singletons.log.e(`[DRM] loadInProgress fails: ${err}`);
                        handler?.bad();
                    } else {
                        handler?.ok(items);
                    }
                    if (!preload && items.length > 0) {
                        items.forEach((item: AssetManager.RequestItem | T) => {
                            if (item instanceof Asset) this._cacheAsset(item, type, bundle.name);
                        });
                    }
                }
            );
        });
    }

    /**
     * 加载bundle
     * @param nameOrUrl bundle路径
     */
    public loadBundle(nameOrUrl: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve) => {
            let bundle = assetManager.getBundle(nameOrUrl);
            if (bundle) {
                resolve(bundle);
                return;
            }
            assetManager.loadBundle(nameOrUrl, (error: Error, bundle: AssetManager.Bundle) => {
                if (error) {
                    Singletons.log.e(`[DRM] loadBundle error: ${error}`);
                    resolve(null);
                } else {
                    resolve(bundle);
                }
            });
        });
    }

    /**
     * 加载单个资源
     * - 加载不会增加引用计数
     * @param bundle 资源包
     * @param path 资源路径
     * @param type 资源类型
     * @returns
     */
    private async _loadAsset<T extends Asset>(
        bundle: AssetManager.Bundle,
        path: string,
        type: typeof Asset
    ): Promise<T | null> {
        path = this._realPath(path, type);
        let asset = bundle.get(path, type);
        if (!asset) {
            return await new Promise((resolve) => {
                bundle.load(path, type, (e: Error, asset: T) => {
                    if (e) {
                        Singletons.log.e(`[DRM] load error: ${e}`);
                        resolve(null);
                        return;
                    }
                    this._cacheAsset(asset, type, bundle.name);
                    resolve(asset);
                });
            });
        }
    }

    /**
     * 将资源加入缓存
     * @param asset 资源
     * @param type 资源类型
     * @param bundle 资源隶属的包
     */
    private _cacheAsset(asset: Asset, type: typeof Asset, bundle: string) {
        if (asset instanceof SpriteAtlas) {
            asset.getSpriteFrames().forEach((v) => this._addCache(v, type, bundle));
        }
        this._addCache(asset, type, bundle);
    }

    /**
     * 加载单个资源
     * @param path 资源路径
     * @param type 资源类型
     * @param bundleNameOrUrl 资源包名称或地址
     * @returns
     */
    async load<T extends Asset>(
        path: string,
        type: typeof Asset,
        bundleNameOrUrl: string = "resources"
    ): Promise<T | null> {
        let bundle = await this.loadBundle(bundleNameOrUrl);
        if (!bundle) {
            Singletons.log.e(`[DRM] cant find bundle: ${bundleNameOrUrl}`);
            return null;
        }
        return await this._loadAsset<T>(bundle, path, type);
    }

    /**
     * 加载指定目录下的指定类型的资源
     * @param dir 资源目录
     * @param type 资源类型
     * @param bundleNameOrUrl 资源包名称或地址
     * @returns
     */
    async loadMany<T extends Asset>(
        dir: string,
        type: typeof Asset,
        bundleNameOrUrl: string = "resources"
    ): Promise<T[]> {
        let bundle = await this.loadBundle(bundleNameOrUrl);
        if (!bundle) {
            Singletons.log.e(`[DRM] cant find bundle: ${bundleNameOrUrl}`);
            return null;
        }
        return new Promise((resolve) => {
            bundle.loadDir(dir, type, (e, assets: T[]) => {
                if (e) {
                    Singletons.log.e(`[DRM] loadDir error: ${e}`);
                }
                if (assets.length > 0) {
                    assets.forEach((v) => this._addCache(v, type, bundle.name));
                }
                resolve(assets);
            });
        });
    }

    /**
     * 资源是否存在缓存中
     * @param asset 资源
     * @returns
     */
    private _hasCache(asset: Asset) {
        return this._cache.has((<any>asset)._uuid);
    }

    /**
     * 添加资源到缓存
     * @param asset 资源
     * @param type 资源类型
     * @param bundle 资源包名称或地址
     */
    private _addCache(asset: Asset, type: typeof Asset, bundle: string) {
        this._cache.set((<any>asset)._uuid, { asset, bundle, type });
        Singletons.log.i(`[DRM] ${asset.name}<${(<any>asset)._uuid}> 引用计数: ${asset.refCount}`);
    }

    /**
     * 从缓存中移除资源
     * @param uuid 资源uuid
     */
    private _removeCache(uuid: string) {
        this._cache.delete(uuid);
    }

    /**
     * 增加资源引用计数
     * @param asset 资源
     */
    private _addRef(asset: Asset) {
        asset.addRef();
        this.dumpCache(asset);
    }

    /**
     * 减少资源引用计数
     * @param asset 资源
     */
    private _decRef(asset: Asset) {
        if (asset.refCount > 0) {
            asset.decRef();
        }
        asset.refCount <= 0 && this._removeCache((<any>asset)._uuid);
        this.dumpCache(asset);
    }

    /**
     * 输出缓存资源数量
     */
    public dumpCache(asset?: Asset) {
        if (asset) {
            Singletons.log.i(`${asset.name}<${(<any>asset)._uuid}> 引用计数: ${asset.refCount}`);
        } else {
            let output = [`[DRM] 缓存资源数量: ${this._cache.size}`];
            for (let item of this._cache) {
                let [uuid, cache] = item;
                output.push(`  ${cache.asset.name}<${uuid}> 引用计数: ${cache.asset.refCount}`);
            }
            Singletons.log.i(output.join("\n"));
        }
    }

    /**
     * 移除所有缓存的资源
     */
    public removeAll() {
        this._cache.forEach((v) => assetManager.releaseAsset(v.asset));
        this._cache.clear();
    }

    /**
     * 增加资源的引用计数
     * - 注意：
     * - 在操作的过程中会尝试减持之前持有的资源的引用计数
     * @param component 渲染组件
     * @param asset 资源
     */
    use<C extends UIRenderer, R extends Asset>(component: C, asset: R) {
        this.unuse(component);

        if (component instanceof Sprite) {
            if (asset && asset.isValid && asset instanceof SpriteFrame && this._hasCache(asset)) {
                component.spriteFrame = asset;
                this._addRef(asset);
            }
        }
    }

    /**
     * 减少资源的引用计数
     * @param component 渲染组件
     */
    unuse<C extends UIRenderer>(component: C) {
        if (component instanceof Sprite) {
            let asset = component.spriteFrame;
            if (asset && asset.isValid && this._hasCache(asset)) {
                component.spriteFrame = null;
                this._decRef(asset);
            }
        }
    }

    /**
     * 从预制体实例化节点
     * @param nodeOrPrefab 节点或预制体
     * @returns
     */
    public useNode(nodeOrPrefab: Node | Prefab) {
        let prefab = null;
        if (nodeOrPrefab instanceof Node) {
            prefab = (nodeOrPrefab as any)._prefab;
        } else if (nodeOrPrefab instanceof Prefab) {
            prefab = nodeOrPrefab;
        }
        if (prefab && prefab.isValid && this._hasCache(prefab)) {
            this._addRef(prefab);
        }
        return instantiate(nodeOrPrefab);
    }

    /**
     * 回收从预制体实例化的节点
     * @param node 节点
     */
    public unuseNode(node: Node) {
        if (node && node.isValid) {
            let prefab = (node as any)._prefab;
            node.removeFromParent();
            if (prefab && prefab.isValid && this._hasCache(prefab)) {
                this._decRef(prefab);
            }
        }
    }
}
