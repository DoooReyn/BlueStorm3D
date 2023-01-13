import { _decorator } from "cc";
import { AutomaticRangeValue } from "../../../value/automatic_number";
import { ProgressBar } from "./progress_bar";

const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/control/ring_bar.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : RingBar
 * Desc     : 环形进度条
 */
@ccclass("ring_bar")
export class RingBar extends ProgressBar {
    @property({ displayName: "起始角度", range: [0, 1, 0.1] })
    protected startAngle_: number = 0;

    /**
     * 起始角度
     */
    protected _rangeStart: AutomaticRangeValue = new AutomaticRangeValue(0, 0, 1);

    protected onLoad() {
        super.onLoad();
        this._rangeStart.value = this.startAngle_;
    }

    protected _drawMaskStencil() {
        const g = this.graphic_;
        g.clear();

        const start_angle = this.rangeStart * Math.PI * 2;

        const r = this.transform_.width * 0.5;
        if (this.range <= 0) {
            g.moveTo(0, 0);
            g.close();
        } else if (this.range >= 1 || this.range <= 0) {
            g.circle(0, 0, r);
        } else {
            const ended_angle = (this.isBackward ? this.range : 1 - this.range) * Math.PI * 2 + start_angle;
            g.arc(0, 0, r, start_angle, ended_angle, this.isBackward);
            g.lineTo(0, 0);
            g.close();
        }
        g.stroke();
        g.fill();
    }

    /**
     * 获取起始角度
     */
    public get rangeStart() {
        return this._rangeStart.value;
    }

    /**
     * 设置起始角度
     */
    public set rangeStart(n: number) {
        this._rangeStart.value = n;
        this._onRangeChanged();
    }
}
