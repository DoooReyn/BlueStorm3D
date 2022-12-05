import { I_LogDelegate } from "./log_delegate";
import { LogLevel } from "./log_level";

/**
 * Url      : db://assets/scripts/base/log/log_console.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:42:56 GMT+0800 (中国标准时间)
 * Class    : LogConsole
 * Desc     : 控制台日志输出工具
 */
export class LogConsole implements I_LogDelegate {
    private _delegates: any = {};

    public constructor() {
        this._delegates[LogLevel.DEBUG] = console.debug;
        this._delegates[LogLevel.INFO] = console.info;
        this._delegates[LogLevel.WARN] = console.warn;
        this._delegates[LogLevel.ERROR] = console.error;
    }

    public handle(level: LogLevel, params: any): void {
        let delegate = this._delegates[level] || console.debug;
        delegate.apply(null, params);
    }

    public close(): void {
        throw new Error("Method not implemented!");
    }
}
