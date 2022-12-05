import { I_AudioInfo } from "./audio_info";

/**
 * 框架在使用 AudioClip 时会自动将上一份的资源引用计数减1，
 * 正常情况下，这样会造成资源播放后立即释放，
 * 因此，建议在游戏加载阶段进行统一的加载流程，
 * 对需要常驻内存的资源引用计数加1
 */

export type T_AudioMap = "bg1" | "click" | "camera" | "cool" | "good";

export const AudioMap: { [key: string | T_AudioMap]: I_AudioInfo } = {
    bg1: { path: "audio/bg_1", loop: true, type: "music", persist: true },
    click: { path: "audio/click", persist: true, once: true },
    camera: { path: "audio/camera", once: true },
    cool: { path: "audio/cool" },
    good: { path: "audio/good" },
};
