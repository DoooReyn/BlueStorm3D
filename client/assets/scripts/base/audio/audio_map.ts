/**
 * Url      : db://assets/scripts/base/audio/audio_nap.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 音频资源信息映射表
 */
import { Enum } from "cc";
import { pickKeyAsEnum } from "../func/utils";
import { AudioInfo } from "../res/res_info";

/**
 * 音频资源信息映射表
 */
export const AudioMap = {
    bg1: AudioInfo.from({ path: "audio/bg_1", loop: true, form: "music", persist: true }),
    click: AudioInfo.from({ path: "audio/click", persist: true, once: true }),
    camera: AudioInfo.from({ path: "audio/camera", once: true }),
};

export type T_AudioMap = keyof typeof AudioMap;

export const E_AudioMap = pickKeyAsEnum(AudioMap);
