import { _decorator } from "cc";
import { RingBar } from "./ring_bar";
const { ccclass } = _decorator;

/**
 * Url      : db://assets/scripts/base/control/square_ring_bar.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : SquareRingBar
 * Desc     : 正方形内环形进度条
 */
@ccclass("square_ring_bar")
export class SquareRingBar extends RingBar {
    protected _drawMaskStencil() {
        const { width, height } = this.transform_;
        const start_x = -width * 0.5;
        const start_y = -height * 0.5;
        const g = this.graphic_;
        g.clear();

        if (this.range <= 0) {
            g.moveTo(0, 0);
            g.close();
        } else if (this.range >= 1 || this.range <= 0) {
            g.rect(start_x, start_y, width, height);
        } else {
            g.moveTo(0, 0);
            this.isForward ? this._trackForward() : this._trackBackward();
            g.close();
        }
        g.stroke();
        g.fill();
    }

    /**
     * 根据弧度绘制绘制正方形上的一个点
     * @param r 弧度
     */
    private _drawPieceOfTrack(r: number) {
        r = r < 0 ? r + 1 : r;
        r = r > 1 ? r - 1 : r;
        const [x, y] = this._getArcTrack(r);
        this.graphic_.lineTo(x, y);
    }

    /**
     * 根据起始弧度和结束弧度绘制正方形上的所有连接点
     * @param start 起始弧度
     * @param ended 结束弧度
     */
    private _drawTracks(start: number, ended: number) {
        this._drawPieceOfTrack(start);
        let next = this._getNextCorner(start);
        while (true) {
            if (next >= ended) break;
            this._drawPieceOfTrack(next);
            next += 0.25;
        }
        this._drawPieceOfTrack(ended);
    }

    /**
     * 根据弧度获取正方形上逆时针方向的下一个拐点
     * @param r 弧度
     * @returns
     */
    private _getNextCorner(r: number) {
        r = r < 0 ? r + 1 : r;
        r = r > 1 ? r - 1 : r;
        const square = [0.125, 0.375, 0.625, 0.875];
        for (let i = 0; i < square.length; i++) {
            const p = square[i];
            if (r <= p) {
                return p;
            }
        }
        return square[3] + 0.25;
    }

    /**
     * 顺时针绘制
     */
    protected _trackForward() {
        let [range, rangeStart] = [this.range, this.rangeStart];
        let start = rangeStart;
        let ended = rangeStart - range;
        [start, ended] = [ended, start];
        if (start < 0) {
            start += 1;
            ended = start + range;
        }
        this._drawTracks(start, ended);
    }

    /**
     * 逆时针绘制
     */
    protected _trackBackward() {
        let [range, rangeStart] = [this.range, this.rangeStart];
        let start = rangeStart;
        let ended = rangeStart + range;
        this._drawTracks(start, ended);
    }

    /**
     * 根据弧度获取正方形上的轨迹点的位置
     * @param range 弧度
     * @returns
     */
    protected _getArcTrack(range: number) {
        const { width, height } = this.transform_;
        const r = Math.sqrt(Math.pow(width * 0.5, 2) + Math.pow(height * 0.5, 2));
        const angle = range * Math.PI * 2;
        const x = Math.cos(angle);
        const y = Math.sin(angle);
        const xo = Math.sign(x);
        const yo = Math.sign(y);
        const xs = (x * r + xo * 0.5) | 0;
        const ys = (y * r + yo * 0.5) | 0;
        const xp = (xo * (width * 0.5 + 0.5)) | 0;
        const yp = (yo * (height * 0.5 + 0.5)) | 0;
        if ((range >= 0.125 && range <= 0.375) || (range >= 0.625 && range <= 0.875)) {
            return [xs, yp];
        } else {
            return [xp, ys];
        }
    }
}
