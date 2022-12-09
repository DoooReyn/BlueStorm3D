/**
 * Url      : db://assets/scripts/base/func/utils.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 辅助方法
 */

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
    if (node) {
        node.parentElement.removeChild(node);
    }
}
