import { I_LogDelegate } from "./log_delegate";
import { LogLevel } from "./log_level";

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
