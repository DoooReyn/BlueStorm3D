/**
 * Url      : db://assets/scripts/base/log/log_delegate.ts
 * Class    : Log
 * Author   : reyn
 * Date     : Tue Nov 29 2022 20:15:59 GMT+0800 (中国标准时间)
 * Desc     : 文件日志代理
 */
import { LogLevel } from "./log_level";

export interface I_LogDelegate {
    handle(level: LogLevel, params: any): void;
    close(): void;
}
