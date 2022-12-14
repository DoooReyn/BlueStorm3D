import { I_LogDelegate } from "./log_delegate";
import { LogConsole } from "./log_console";
import { LogFile } from "./log_file";
import { LogLevel } from "./log_level";
import { sys } from "cc";
import SingletonBase from "../singleton_base";
import { idle, T_IdleFunction } from "../func/utils";

/**
 * Url      : db://assets/scripts/base/log/log.ts
 * Class    : Log
 * Author   : reyn
 * Date     : Tue Nov 29 2022 20:15:59 GMT+0800 (中国标准时间)
 * Desc     : 日志管理器
 */
export class Log extends SingletonBase {
    private _on: boolean = true;
    private _level: LogLevel = LogLevel.DEBUG;
    private _delegates: I_LogDelegate[] = [];
    public d: T_IdleFunction = this._handle.bind(this, LogLevel.DEBUG);
    public i: T_IdleFunction = this._handle.bind(this, LogLevel.INFO);
    public w: T_IdleFunction = this._handle.bind(this, LogLevel.WARN);
    public e: T_IdleFunction = this._handle.bind(this, LogLevel.ERROR);

    protected onInitialize(): void {
        this._delegates.push(new LogConsole());
        if (sys.isNative) {
            this._delegates.push(new LogFile());
        }
    }

    protected onDestroy(): void {
        this.close();
    }

    /**
     * 获得日志等级
     */
    public get level() {
        return this._level;
    }

    /**
     * 设置日志等级
     */
    public set level(l: LogLevel) {
        this._level = l;
    }

    /**
     * 是否开启日志
     */
    public get on() {
        return this._on;
    }

    /**
     * 设置是否开启日志
     */
    public set on(o: boolean) {
        this._on = o;

        if (o) {
            console.log = this.d;
            console.debug = this.d;
            console.info = this.i;
            console.warn = this.w;
            console.error = this.e;
        } else {
            this.level = LogLevel.WARN;
            console.log = idle;
            console.debug = idle;
            console.info = idle;
            console.warn = this.w;
            console.error = this.e;
        }
    }

    /**
     * 处理日志
     * @param level 日志等级
     * @param params 参数列表
     * @returns
     */
    private _handle(level: LogLevel, ...params: any[]) {
        if (this._level > level) return;

        this._delegates.forEach((d) => {
            d.handle(level, params);
        });
    }

    /**
     * 关闭日志
     */
    public close() {
        this._delegates.forEach((d) => d.close());
    }
}
