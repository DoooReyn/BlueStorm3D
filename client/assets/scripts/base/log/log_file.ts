import { native, sys } from "cc";
import { I_LogDelegate } from "./log_delegate";
import { LogLevel } from "./log_level";
import { LogConsole } from "./log_console";

/**
 * Url      : db://assets/scripts/base/log/log_file.ts
 * Class    : LogFile
 * Author   : reyn
 * Date     : Tue Nov 29 2022 20:15:59 GMT+0800 (中国标准时间)
 * Desc     : 文件日志
 */
export class LogFile implements I_LogDelegate {
  private _fileObj: any = null;
  private _fileAt: string = "";
  private _console: LogConsole = null;

  protected getLogFileAt() {
    let date = new Date();
    let root = native.fileUtils.getWritablePath() + "/log";
    if (!native.fileUtils.isDirectoryExist(root)) {
      native.fileUtils.createDirectory(root);
    }
    return `${root}/${date.getTime().toLocaleString()}.log`;
  }

  public handle(level: LogLevel, params: any[]): void {
    const log = params.map((c) => c.toString()).join("\r\n");
    if (sys.isNative) {
      if (!this._fileObj) {
        this._fileAt = this.getLogFileAt();
        const FileObject = (window as any).FileObject;
        this._fileObj = new FileObject(this._fileAt, "w+");
      }
      this._fileObj.write(log);
    } else {
      this._console = this._console || new LogConsole();
      this._console.handle(level, params);
    }
  }

  public close(): void {
    if (this._fileObj) {
      this._fileObj.close();
      this._fileObj = null;
    }
    if (this._console) {
      delete this._console;
      this._console = null;
    }
  }
}
