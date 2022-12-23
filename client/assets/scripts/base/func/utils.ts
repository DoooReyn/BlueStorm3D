/**
 * Url      : db://assets/scripts/base/func/utils.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 辅助方法
 */

import { Enum, Node, screen } from "cc";

/**
 * @zh
 * 一般方法回调处理类型定义
 * @param ok 成功回调
 * @param bad 失败回调
 */
export type T_CmmHandler = { ok?: Function; bad?: Function };

/**
 * 进度回调
 * - finished: 完成数
 * - total: 总数
 */
export type T_ProgressHandler = (finished: number, total: number) => void;

/**
 * @zh
 * 资源加载回调处理类型定义
 * @param ok 成功回调
 * @param bad 失败回调
 * @param progress 进度回调
 */
export type T_LoadHandler = T_CmmHandler & { progress?: T_ProgressHandler | Function };

/**
 * @zh
 * 错误处理回调类型定义
 */
export type T_ErrorHandler = (msg: string, stack: string) => void;

/**
 * 闲置方法
 * @param params
 */
export function idle(...params: any[]) {}
/**
 * 闲置方法类型
 */
export type T_IdleFunction = typeof idle;

/**
 * 安全地调用方法
 * @param handler 调用参数
 */
export function runInSandbox(handler: { onExcute: Function; onError?: T_ErrorHandler; onFinal?: Function }) {
    try {
        typeof handler.onExcute === "function" && handler.onExcute();
    } catch (err) {
        let { message, stack } = err;
        typeof handler.onError === "function" && handler.onError(message, stack);
    } finally {
        typeof handler.onFinal === "function" && handler.onFinal();
    }
}

/**
 * 关闭 DOM 报错节点
 * - 烦死了这个鬼东西
 */
export function disableDomErrorNode() {
    const node = document.querySelector("#error");
    node && node.parentElement.removeChild(node);
}

/**
 * 是否对象类型
 * @param args 参数
 * @returns
 */
export function isObject(args: any) {
    return (typeof args === "object" || typeof args === "function") && typeof args !== null;
}

/**
 * 深度拷贝
 * @param target 目标
 * @returns
 */
export function deepClone<T>(target: T): T {
    if (!isObject(target)) return target;

    let newObj = Array.isArray(target) ? [...target] : { ...target };
    Reflect.ownKeys(newObj as any).map((key) => {
        newObj[key] = isObject(target[key]) ? deepClone(target[key]) : target[key];
    });

    return newObj as T;
}

/**
 * 同步原始对象的key到目标对象上
 * @param target 目标对象
 * @param raw 原始对象
 */
export function sync(target: object, raw: object) {
    for (let key in raw) {
        if (target[key] === undefined) {
            target[key] = deepClone(raw[key]);
        }
    }
}

/**
 * 获取节点在场景树中的树路径
 * @param node 节点
 * @return 节点路径
 */
export function getNodeUrl(node: Node) {
    let path: string[] = [];
    while (node.parent) {
        path.push(node.name);
        node = node.parent;
    }
    return path.reverse().join("/");
}

/**
 * 切换全屏
 */
export function switchFullscreen() {
    if (screen.supportsFullScreen) {
        screen.fullScreen() ? screen.exitFullScreen() : screen.requestFullScreen();
    }
}

/**
 * 将对象的键转换为 Enum
 * @param obj 对象
 * @returns
 */
export function pickKeyAsEnum(obj: object): { [key: string]: number } {
    let ret = {};
    Object.keys(obj).forEach((v, i) => (ret[v] = i));
    return Enum(ret);
}
