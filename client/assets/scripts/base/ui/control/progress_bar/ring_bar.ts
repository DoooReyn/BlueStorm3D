import { _decorator } from "cc";
import { AutomaticRangeValue } from "../../../value/automatic_number";
import { ProgressBar } from "./progress_bar";

const { ccclass, property } = _decorator;

@ccclass("ring_bar")
export class RingBar extends ProgressBar {
    @property({ displayName: "起始角度", range: [0, 1, 0.1] })
    protected startAngle_: number = 0;

    /**
     * 起始角度
     */
    private _rangeStart: AutomaticRangeValue = new AutomaticRangeValue(0, 0, 1);

    protected onLoad() {
        super.onLoad();
        this._rangeStart.value = this.startAngle_;
    }

    protected _drawMaskStencil() {
        const g = this.graphic_;
        g.clear();

        const start_angle = this._rangeStart.value * Math.PI * 2;

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
