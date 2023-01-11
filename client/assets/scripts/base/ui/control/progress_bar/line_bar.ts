import { Enum, _decorator } from "cc";
import { ProgressBar } from "./progress_bar";

const { ccclass, property } = _decorator;

enum E_LineBar_Layout {
    Horizontal,
    Vertical,
}

@ccclass("line-bar")
export class LineBar extends ProgressBar {
    @property({ displayName: "布局方式", type: Enum(E_LineBar_Layout) })
    protected layout_ = E_LineBar_Layout.Horizontal;

    protected _drawMaskStencil() {
        const { width, height } = this.transform_;
        const start_x = -width * 0.5;
        const start_y = -height * 0.5;
        const g = this.graphic_;
        let [x, y, w, h] = [0, 0, 0, 0];
        g.clear();

        if (this.range <= 0) {
            g.moveTo(0, 0);
            g.close();
        } else if (this.range >= 1) {
            g.rect(start_x, start_y, width, height);
        } else {
            if (this.isHorizontal) {
                x = start_x + (this.isForward ? 0 : width * (1 - this.range));
                y = start_y;
                w = width * this.range;
                h = height;
            } else {
                x = start_x;
                y = start_y + (this.isForward ? 0 : height * (1 - this.range));
                w = width;
                h = height * this.range;
            }
            g.rect(x, y, w, h);
        }
        g.stroke();
        g.fill();
    }

    /**
     * 获取布局
     */
    public get layout() {
        return this.layout_;
    }

    /**
     * 设置布局
     */
    public set layout(v: E_LineBar_Layout) {
        this.layout_ = v;
        this._onRangeChanged();
    }

    /**
     * 是否水平布局
     */
    public get isHorizontal() {
        return this.layout_ === E_LineBar_Layout.Horizontal;
    }

    /**
     * 是否垂直布局
     */
    public get isVertical() {
        return this.layout_ === E_LineBar_Layout.Vertical;
    }
}
