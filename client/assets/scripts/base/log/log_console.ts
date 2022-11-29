import { LogDelegate } from "./log_delegate";
import { LogLevel } from "./log_level";

export class LogConsole implements LogDelegate {
  private _delegates: any = {};

  constructor() {
    this._delegates[LogLevel.DEBUG] = console.debug;
    this._delegates[LogLevel.INFO] = console.info;
    this._delegates[LogLevel.WARN] = console.warn;
    this._delegates[LogLevel.ERROR] = console.error;
  }

  handle(level: LogLevel, params: any): void {
    let delegate = this._delegates[level] || console.debug;
    delegate.apply(null, params);
  }

  close(): void {
    throw new Error("Method not implemented!");
  }
}
