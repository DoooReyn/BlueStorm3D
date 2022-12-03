import { Enum } from "cc";

/**
 * Url      : db://assets/scripts/base/i18n/i18n_map.ts
 * Author   : reyn
 * Date     : Fri Dec 02 2022 15:06:55 GMT+0800 (中国标准时间)
 * Desc     : 多语言文本映射
 */

/**
 * 支持的语言
 * - ZH: 中
 * - EN: 英
 */
export enum E_SupportLanguages {
    ZH = "ZH",
    EN = "EN",
}

/**
 * 语言项类型
 * - Text: 文本
 * - Other: 其他（原理上支持任意类型，毕竟内容是交给监听者自己处理的）
 */
export enum E_i18nType {
    Text = 1,
    Other,
}

/**
 * 语言项信息
 * - ZH: 中 文本/资源
 * - EN: 英 文本/资源
 * - type: 语言项类型
 * - atlas: 图像资源隶属的图集
 * - bundle: 资源隶属的包（建议将相关资源放在一个独立的包下）
 */
export interface I_i18nItem {
    ZH: string;
    EN: string;
    type?: E_i18nType;
    bundle?: string;
    atlas?: string;
}

/**
 * 语言翻译库
 */
const i18nLibrary: { [key: string]: I_i18nItem } = {
    LangZH: { ZH: "中文", EN: "Chinese" },
    LangEN: { ZH: "英文", EN: "English" },
    CurrentLanguage: { ZH: "当前语言", EN: "Current Language" },
    SwitchLanguage: { ZH: "切换语言", EN: "Change Language" },
    SpLang: {
        ZH: "zh_button_album",
        EN: "en_button_album",
        bundle: "i18n",
        type: E_i18nType.Other,
    },
};

/**
 * 语言项列表
 */
export const i18nKeyMap = Enum({
    LangZH: 101,
    LangEN: 102,
    CurrentLanguage: 103,
    SwitchLanguage: 104,
    SpLang: 10001,
});

/**
 * 语言项列表
 */
export type T_i18nKey = keyof typeof i18nKeyMap;

/**
 * 语言内容
 * - text: 文本/资源
 * - bundle: 资源隶属的包
 * - atlas: 图像资源隶属的图集
 */
export interface I_i18nContent {
    text: string;
    bundle?: string;
    atlas?: string;
}

/**
 * 语言项监听者
 */
export interface I_i18nListener {
    getI18nKey(): T_i18nKey;
    onI18nContentChanged(content: I_i18nContent): void;
}

/**
 * 获取语言项内容
 * @param k 语言项
 * @returns
 */
export function getI18nItem(k: T_i18nKey) {
    return i18nLibrary[k];
}
