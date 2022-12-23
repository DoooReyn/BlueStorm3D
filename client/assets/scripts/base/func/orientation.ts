import { sys } from "cc";
import { E_Event_Internal } from "../event/event_internal";
import { Singletons } from "../singletons";
import SingletonBase from "../singleton_base";

/**
 * Url      : db://assets/scripts/base/func/orientation.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:32:07 GMT+0800 (中国标准时间)
 * Class    : Orientation
 * Desc     : 屏幕朝向管理
 */
export class Orientation extends SingletonBase {
    protected onInitialize() {
        if (this.available) {
            window.addEventListener(E_Event_Internal.OrientationChanged, () => {
                Singletons.event.user.emit(E_Event_Internal.OrientationChanged, this.angle);
            });
        }
    }

    protected onDestroy(): void {}

    /**
     * 屏幕角度
     */
    public get angle() {
        if ("orientation" in window) {
            return orientation;
        } else if ("screen" in window) {
            return screen.orientation.angle;
        }
        return 0;
    }

    /**
     * 是否可用
     */
    public get available() {
        return sys.isBrowser || sys.os in [sys.OS.ANDROID, sys.OS.IOS];
    }

    /**
     * 是否横屏
     */
    public get isLandscape() {
        return this.angle % 180 === 0;
    }

    /**
     * 是否主横屏
     */
    public get isPrimaryLandscape() {
        return this.angle % 360 === 0;
    }

    /**
     * 是否副横屏
     */
    public get isSideLandscape() {
        return this.isLandscape && !this.isPrimaryLandscape;
    }

    /**
     * 是否竖屏
     */
    public get isPortrait() {
        return !this.isLandscape;
    }

    /**
     * 是否主竖屏
     */
    public get isPrimaryPortrait() {
        if (this.isPortrait) {
            let angle = this.angle;
            while (angle < 0) angle += 360;
            return ((angle / 90) | 0) === 1;
        }
    }

    /**
     * 是否副竖屏
     */
    public get isSidePortrait() {
        return this.isPortrait && !this.isPrimaryPortrait;
    }
}
