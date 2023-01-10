import { AutomaticValue } from "../func/automatic_value";
import { clamp, isInRange } from "../func/numbers";

/**
 * 数值运算操作符
 * - Add 加
 * - Sub 减
 * - Mul 乘
 * - Div 除
 * - Mod 取模
 */
export enum E_Numeric_Operator {
    Add,
    Sub,
    Mul,
    Div,
    Mod
}

/**
 * 自维护的数值
 */
export abstract class AutomaticNumberValue extends AutomaticValue<number> {

    public constructor(v: number) {
        super(v);
        this.trim(v);
    }

    /**
     * 加法
     * @param v 数值
     * @returns
     */
    public add(v: number) {
        return this._operate(E_Numeric_Operator.Add, v);
    }

    /**
     * 减法
     * @param v 数值
     * @returns
     */
    public sub(v: number) {
        return this._operate(E_Numeric_Operator.Sub, v);
    }

    /**
     * 乘法
     * @param v 数值
     * @returns
     */
    public mul(v: number) {
        return this._operate(E_Numeric_Operator.Mul, v);
    }

    /**
     * 除法
     * @param v 数值
     * @returns
     */
    public div(v: number) {
        return this._operate(E_Numeric_Operator.Div, v);
    }

    /**
     * 取模
     * @param v 数值
     * @returns
     */
    public mod(v: number) {
        return this._operate(E_Numeric_Operator.Mod, v);
    }

    /**
     * 执行运算
     * @param v 数值
     * @param operator 运算符
     * @returns
     */
    protected _operate(v: number, operator: E_Numeric_Operator) {
        switch (operator) {
            case E_Numeric_Operator.Add:
                v += this.value;
                break;
            case E_Numeric_Operator.Sub:
                v -= this.value;
                break;
            case E_Numeric_Operator.Mul:
                v *= this.value;
                break;
            case E_Numeric_Operator.Div:
                v = this.value / v;
                break;
            case E_Numeric_Operator.Mod:
                v = this.value % v;
                break;
        }

        return this.value = this.trim(v);
    }

    /**
     * 校正数值
     * @param v 数值
     * @returns
     */
    public abstract trim(v: number): number;
}

/**
 * 自维护的数值
 */
export class AutomaticNumericValue extends AutomaticNumberValue {
    public trim(v: number): number {
        return v;
    }
}

/**
 * 自维护的整数
 */
export class AutomaticIntegerValue extends AutomaticNumberValue {
    public trim(v: number): number {
        return v | 0;
    }
}

/**
 * 自维护的区间数值
 */
export class AutomaticRangeValue extends AutomaticNumberValue {
    /**
     * 最小值/左区间
     */
    private _min: AutomaticNumericValue = new AutomaticNumericValue(0);

    /**
     * 最大值/右区间
     */
    private _max: AutomaticNumericValue = new AutomaticNumericValue(0);

    public constructor(value: number, min: number, max: number) {
        super(value);
        this.setRange(min, max);
    }

    /**
     * 设置区间
     * @param min 最小值
     * @param max 最大值
     */
    public setRange(min: number, max: number) {
        if (min > max) [min, max] = [max, min];
        this._min.value = min;
        this._max.value = max;
        this.value = this.trim(this.value);
    }

    /**
     * 数值是否位于当前区间内
     * @param v 数值
     * @returns
     */
    public isInRange(v: number) {
        return isInRange(v, this.min, this.max);
    }

    /**
     * 获得最小值/左区间
     */
    public get min() {
        return this._min.value;
    }

    /**
     * 获得最大值/右区间
     */
    public get max() {
        return this._max.value;
    }

    /**
     * 设置最小值/左区间
     * @param m 数值
     */
    public set min(m: number) {
        this.setRange(m, this.max);
    }

    /**
     * 设置最大值/右区间
     * @param m 数值
     */
    public set max(m: number) {
        this.setRange(this.min, m);
    }

    public trim(v: number): number {
        return clamp(v, this._min.value, this._max.value);
    }
}
