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
