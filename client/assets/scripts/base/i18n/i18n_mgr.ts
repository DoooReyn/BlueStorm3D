import { sys } from "cc";
import SingletonBase from "../singleton_base";
import {
    E_i18nType,
    E_SupportLanguages,
    getI18nItem,
    I_i18nContent,
    I_i18nListener,
    T_i18nKey,
} from "./i18n_map";

/**
 * Url      : db://assets/scripts/base/i18n/i18n_mgr.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Desc     : 多语言管理器
 */
export class i18nMgr extends SingletonBase {
    /**
     * 当前语言
     */
    private _lang: E_SupportLanguages = E_SupportLanguages.ZH;

    /**
     * 监听者列表
     */
    private _listeners: I_i18nListener[] = [];

    /**
     * 存储项
     */
    private _key: string = null;

    /**
     * 初始化回调
     * @param key 存储项
     */
    onInitialize(key: string = "BlueStorm3#Language") {
        this._key = key;
        this._init();
    }

    onDestroy() {
        this.disconnectAll();
    }

    /**
     * 初始化
     */
    private _init() {
        const lang = sys.localStorage.getItem(this._key);
        if (lang !== undefined && E_SupportLanguages[lang] !== undefined) {
            this._lang = lang as E_SupportLanguages;
        } else {
            this._lang = E_SupportLanguages.ZH;
        }
    }

    /**
     * 查找套监听者
     * @param listener 监听者
     * @returns
     */
    private _findListener(listener: I_i18nListener) {
        return this._listeners.indexOf(listener);
    }

    /**
     * 通知监听者
     * @param listener 监听者
     */
    private _notifyListener(listener: I_i18nListener) {
        const key = listener.getI18nKey();
        const ret = this.content(key);
        listener.onI18nContentChanged(ret);
    }

    /**
     * 语言切换回调
     * @param prev 上次设置的语言
     * @param now 当前语言
     */
    protected _onChanged(prev?: E_SupportLanguages, now?: E_SupportLanguages) {
        const from = this._listeners.length - 1;
        for (let i = from; i >= 0; i--) {
            this._notifyListener(this._listeners[i]);
        }
    }

    /**
     * 当前语言
     */
    public get lang() {
        return this._lang;
    }

    /**
     * 设置语言
     */
    public set lang(l: E_SupportLanguages) {
        if (this._lang !== l) {
            const prev = this._lang;
            this._lang = l;
            this.save();
            this._onChanged(prev, l);
        }
    }

    /**
     * 保存当前语言
     */
    public save() {
        sys.localStorage.setItem(this._key, this._lang);
    }

    /**
     * 是否存在指定监听者
     * @param listener 监听者
     * @returns
     */
    public hasListener(listener: I_i18nListener) {
        return this._findListener(listener) > -1;
    }

    /**
     * 连接监听者
     * @param listener 监听者
     */
    public connect(listener: I_i18nListener) {
        if (!this.hasListener(listener)) {
            this._listeners.push(listener);
            listener.onI18nContentChanged(this.content(listener.getI18nKey()));
        }
    }

    /**
     * 断开监听者
     * @param listener 监听者
     */
    public disconnect(listener: I_i18nListener) {
        const index = this._findListener(listener);
        if (index > -1) {
            this._listeners.splice(index, 1);
        }
    }

    /**
     * 断开所有监听者
     */
    public disconnectAll() {
        this._listeners.length = 0;
    }

    /**
     * 获取语言项内容
     * @param key 语言项
     * @returns
     */
    public content(key: T_i18nKey): I_i18nContent {
        const item = getI18nItem(key);
        const text = item[this._lang];
        const ret: I_i18nContent = { text: text };
        if (item.type === E_i18nType.Other) {
            ret.bundle = item.bundle || "resources";
        }
        return ret;
    }
}
