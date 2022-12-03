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
    Sprite,
    SpriteFrame,
    Texture2D,
    UIRenderer,
} from "cc";
import { Singletons } from "../singletons";
import SingletonBase from "../singleton_base";

export interface I_CacheData {
    asset: Asset;
    path: string;
    type: typeof Asset;
    bundle: string;
}

export class DynamicResMgr extends SingletonBase {
    private _assets: AssetManager = null;
    private _cache: Map<string, I_CacheData> = new Map();

    protected onInitialize(...args: any[]): void {
        this._assets = assetManager;
    }

    protected onDestroy(): void {
        this.removeAll();
    }

    private _realPath(path: string, type: typeof Asset) {
        if (type === SpriteFrame) {
            path += "/spriteFrame";
        } else if (type === Texture2D) {
            path += "/texture";
        }
        return path;
    }

    preload() {}

    /**
     * 加载bundle
     * @param nameOrUrl bundle路径
     */
    loadBundle(nameOrUrl: string): Promise<AssetManager.Bundle> {
        return new Promise((resolve) => {
            let bundle = this._assets.getBundle(nameOrUrl);
            if (bundle) {
                resolve(bundle);
                return;
            }
            assetManager.loadBundle(
                nameOrUrl,
                (error: Error, bundle: AssetManager.Bundle) => {
                    if (error) {
                        Singletons.log.e(`[DRM] loadBundle error: ${error}`);
                        resolve(null);
                    } else {
                        resolve(bundle);
                    }
                }
            );
        });
    }

    /**
     * 加载单个资源
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
        const realpath = this._realPath(path, type);
        let asset = bundle.get(realpath, type);
        if (!asset) {
            return await new Promise((resolve) => {
                bundle.load(realpath, type, (e: Error, asset: T) => {
                    if (e) {
                        Singletons.log.e(`[DRM] load error: ${e}`);
                        resolve(null);
                    } else {
                        this._addCache(asset, path, type, bundle.name);
                        resolve(asset);
                    }
                });
            });
        }
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
        return await this._loadAsset(bundle, path, type);
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
                    assets.forEach((v) =>
                        this._addCache(v, `${dir}/${v.name}`, type, bundle.name)
                    );
                }
                resolve(assets);
            });
        });
    }

    /**
     * 增加资源的引用计数
     * - 当前只实现了 Sprite 组件
     * - 可以在此扩展其他组件
     * @param component 组件
     * @param asset 资源
     */
    use<C extends UIRenderer, R extends Asset>(component: C, asset: R) {
        if (component instanceof Sprite) {
            this.unuse(component);
            if (
                asset &&
                asset.isValid &&
                asset instanceof SpriteFrame &&
                this._hasCache(asset)
            ) {
                component.spriteFrame = asset;
                asset.addRef();
            }
        }
    }

    /**
     * 减少资源的引用计数
     * - 当前只实现了 Sprite 组件
     * - 可以在此扩展其他组件
     * @param component 组件
     */
    unuse<C extends UIRenderer>(component: C) {
        if (component instanceof Sprite) {
            let asset = component.spriteFrame;
            if (asset && asset.isValid && this._hasCache(asset)) {
                component.spriteFrame = null;
                asset.decRef();
                asset.refCount <= 0 && this._removeCache(asset.nativeUrl);
            }
        }
    }

    /**
     * 资源是否存在缓存中
     * @param asset 资源
     * @returns
     */
    private _hasCache(asset: Asset) {
        return this._cache.has(asset.nativeUrl);
    }

    /**
     * 添加资源到缓存
     * @param asset 资源
     * @param path 路径
     * @param bundle 资源包名称或地址
     */
    private _addCache(
        asset: Asset,
        path: string,
        type: typeof Asset,
        bundle: string
    ) {
        this._cache.set(asset.nativeUrl, { asset, bundle, type, path });
        this.dumpCache();
    }

    /**
     * 从缓存中移除资源
     * @param nativeUrl 资源原生地址
     */
    private _removeCache(nativeUrl: string) {
        this._cache.delete(nativeUrl);
        this.dumpCache();
    }

    /**
     * 输出缓存资源数量
     */
    public dumpCache() {
        Singletons.log.d(`[DRM] cache count: ${this._cache.size}`);
    }

    /**
     * 移除所有缓存的资源
     */
    public removeAll() {
        this._cache.forEach((v) => {
            let bundle = assetManager.getBundle(v.bundle);
            bundle && bundle.release(v.asset.nativeUrl);
        });
        Singletons.timer.hook;
    }
}
