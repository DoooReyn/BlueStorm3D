import { Asset, AudioClip, clamp01, Constructor, Prefab } from "cc";

/**
 * 资源基础信息
 */
export interface I_ResInfo {
    path: string;
    bundle?: string;
}

/**
 * 资源基础信息
 */
export class ResInfo<T extends I_ResInfo> {
    protected _info: T = null;
    private _type: typeof Asset;

    protected constructor(info: T, type: typeof Asset) {
        info.bundle = info.bundle || "resources";
        this._type = type;
        this._info = Object.freeze(info);
    }

    public get type() {
        return this._type;
    }

    public get raw() {
        return this._info;
    }
}

/**
 * Ui 资源信息
 */
export type I_UiInfo = I_ResInfo;

/**
 * Ui 资源信息
 */
export class UiInfo extends ResInfo<I_UiInfo> {
    public static from(info: I_UiInfo) {
        return new ResInfo(info, Prefab);
    }
}

/**
 * 音频类型
 */
export type T_AudioForm = "effect" | "music";

/**
 * 音频资源信息
 * - path       资源路径
 * - form       音频类型，可选 music / effect
 * - bundle     资源隶属的包
 * - volume     音频音量倍数（微调）
 * - loop       是否循环播放
 * - persist    是否常驻内存
 * - once       是否使用 playOneShot
 *      - playOneShot 不可打断，且不可循环播放
 *      - 正常音效都需要打开这个开关
 *      - 只有特定的、需要打断和循环播放的才不需要打开这个开关
 */
export interface I_AudioInfo extends I_ResInfo {
    form?: T_AudioForm;
    bundle?: string;
    volume?: number;
    loop?: boolean;
    persist?: boolean;
    once?: boolean;
}

/**
 * 音频资源信息
 */
export class AudioInfo extends ResInfo<I_AudioInfo> {
    protected constructor(info: I_AudioInfo) {
        info.form = info.form || "effect";
        info.volume = clamp01(info.volume || 1.0);
        info.loop = info.loop || false;
        info.persist = info.persist || false;
        info.once = info.once || false;
        super(info, AudioClip);
    }

    public static from(info: I_AudioInfo) {
        return new AudioInfo(info);
    }
}
