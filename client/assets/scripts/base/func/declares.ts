/**
 * Url      : db://assets/scripts/base/func/declares.ts
 * Author   : reyn
 * Date     : Sun Dec 04 2022 15:15:59 GMT+0800 (中国标准时间)
 * Desc     : 声明
 */

/**
 * 边界原型
 */
export interface I_Cmm_Boundary {
    left: number;
    right: number;
    top: number;
    bottom: number;
    toString?(): string;
}

/**
 * 方向
 * - Backward: 上一页/后退
 * - Forward: 下一页/前进
 */
export enum E_Cmm_Direction {
    Backward = -1,
    Forward = 1,
}

/**
 * 滑动方向信息
 */
export interface I_SlideDirectionInfo {
    scrollable: boolean;
    dir: E_Cmm_Direction;
}
