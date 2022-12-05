/**
 * Url      : db://assets/scripts/base/audio/audio_nap.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 音频各种接口定义
 */

/**
 * 音频播放回调
 * onError          加载错误回调
 * onStarted        开始播放回调
 * onFinished       完成播放回调
 * onFinishedOnce   完成一次播放回调
 */
export interface I_AudioHandler {
    onError?: (err: Error | string) => void;
    onStarted?: Function;
    onFinished?: Function;
    onFinishedOnce?: Function;
}

/**
 * 音频信息
 * - path       资源路径
 * - type       音频类型，可选 music / effect
 * - bundle     资源隶属的包
 * - volume     音频音量倍数（微调）
 * - loop       是否循环播放
 * - persist    是否常驻内存
 * - once       是否使用 playOneShot
 *      - playOneShot 不可打断，且不可循环播放
 *      - 正常音效都需要打开这个开关
 *      - 只有特定的、需要打断和循环播放的才不需要打开这个开关
 */
export interface I_AudioInfo {
    path: string;
    type?: "music" | "effect";
    bundle?: string;
    volume?: number;
    loop?: boolean;
    persist?: boolean;
    once?: boolean;
}
