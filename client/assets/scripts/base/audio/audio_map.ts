/**
 * Url      : db://assets/scripts/base/audio/audio_nap.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 音频资源信息映射表
 */
import { I_AudioInfo } from "./audio_info";

/**
 * 音频资源信息映射表
 */
export const AudioMap: { [key: string]: I_AudioInfo } = {
    bg1: { path: "audio/bg_1", loop: true, type: "music", persist: true },
    click: { path: "audio/click", persist: true, once: true },
    camera: { path: "audio/camera", once: true },
    cool: { path: "audio/cool" },
    good: { path: "audio/good" },
};
