/**
 * Url      : db://assets/scripts/base/path/path_grid.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Desc     : 地图网格
 */

/**
 * 寻路网格枚举类型
 * - Start  起点
 * - Stop   终点
 * - Block  灰点（不可达点）
 * - Empty  白点（可达点）
 */
export enum E_Path_GridType {
    Start,
    Stop,
    Block,
    Empty,
}

/**
 * 寻路行为枚举类型
 * - None       无
 * - DrawBlock  绘制灰点
 * - EraseBlock 删除灰点
 * - MoveStart  移动起点
 * - MoveStop   移动终点
 */
export enum E_Path_MoveBehavior {
    None,
    DrawBlock,
    EraseBlock,
    MoveStart,
    MoveStop,
}
