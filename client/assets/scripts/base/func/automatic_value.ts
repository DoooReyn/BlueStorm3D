/**
 * Url      : db://assets/scripts/base/ui/ui_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 14:35:21 GMT+0800 (中国标准时间)
 * Class    : AutomaticValue
 * Desc     : 自维护的原始值
 */
export class AutomaticValue<T extends string | number | boolean> {
    private _value: T;

    public constructor(v: T) {
        this._value = v;
    }

    /**
     * 获取值
     */
    public get value() {
        return this._value;
    }

    /**
     * 设置值
     */
    public set value(v: T) {
        if (this._value !== v) {
            const prev = this._value;
            this._value = v;
            this._onValueChanged(prev, v);
        }
    }

    /**
     * 值变化回调
     * @param prev 之前值
     * @param current 当前值
     */
    protected _onValueChanged(prev: T, current: T) {}
}

export class AutomaticBooleanValue extends AutomaticValue<boolean> {
    public set() {
        this.value = true;
    }

    public unset() {
        this.value = false;
    }

    public isset() {
        return this.value;
    }
}
