import {Enum, _decorator} from "cc";
import { ProgressBar } from "./progress_bar";

const {ccclass, property} = _decorator;

/**
 * 布局方式
 * - Horizontal 水平
 * - Vertical   垂直
 */
enum E_LineBar_Layout {
    Horizontal,
    Vertival
}

/**
 * 伸展方向
 * - Forward  水平：从左到右，垂直：从下到上
 * - Backward 水平：从右到左，垂直：从上到下
 */
enum E_LineBar_Direction {
    Forward,
    Backwaard
}

@ccclass("line-bar")
export class LineBar extends ProgressBar {
    @property({displayName: "布局方式", type: Enum(E_LineBar_Layout)})
    layout = E_LineBar_Layout.Horizontal;

    @property({displayName: "伸展方向", type: Enum(E_LineBar_Direction)})
    direction = E_LineBar_Direction.Forward;

    protected _onRangeChanged() {

    }
}
