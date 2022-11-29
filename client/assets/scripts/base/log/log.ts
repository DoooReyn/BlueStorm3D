import { I_LogDelegate } from "./log_delegate";
import { LogConsole } from "./log_console";
import { LogFile } from "./log_file";
import { LogLevel } from "./log_level";
import { sys } from "cc";

type T_ConsoleFunction = (...data: any[]) => void;
function none(...data: any[]) {}

/**
 * Url      : db://assets/scripts/base/log/log.ts
 * Class    : Log
 * Author   : reyn
 * Date     : Tue Nov 29 2022 20:15:59 GMT+0800 (中国标准时间)
 * Desc     : 日志管理器
 */
export class Log {
  private _on: boolean = true;
  private _level: LogLevel = LogLevel.DEBUG;
  private _delegates: I_LogDelegate[] = [];
  public d: T_ConsoleFunction = this._handle.bind(this, LogLevel.DEBUG);
  public i: T_ConsoleFunction = this._handle.bind(this, LogLevel.INFO);
  public w: T_ConsoleFunction = this._handle.bind(this, LogLevel.WARN);
  public e: T_ConsoleFunction = this._handle.bind(this, LogLevel.ERROR);

  public constructor() {
    this._delegates.push(new LogConsole());
    if (sys.isNative) {
      this._delegates.push(new LogFile());
    }
  }

  public get level() {
    return this._level;
  }

  public set level(l: LogLevel) {
    this._level = l;
  }

  public get on() {
    return this._on;
  }

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
      console.log = none;
      console.debug = none;
      console.info = none;
      console.warn = this.w;
      console.error = this.e;
    }
  }

  private _handle(level: LogLevel, ...params: any[]) {
    if (this._level > level) return;

    this._delegates.forEach((d) => {
      d.handle(level, params);
    });
  }

  public close() {
    this._delegates.forEach((d) => d.close());
  }
}
