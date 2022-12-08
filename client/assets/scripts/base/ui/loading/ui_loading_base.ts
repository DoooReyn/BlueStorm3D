import { _decorator } from "cc";
import { AutomaticValue } from "../../func/automatic_value";
import { CE_UI_Type } from "../ui_base";
import { UiDisableTouch } from "../ui_disable_touch";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_loading_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:59 GMT+0800 (中国标准时间)
 * Class    : UiLoadingBase
 * Desc     : Loading 页面基类
 * - 一般指资源加载页面、场景切换页面
 */
@ccclass("ui_loading_base")
export class UiLoadingBase extends UiDisableTouch {
    // REGION START <Member Variable>

    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Loading;

    /**
     * 页面被引用次数
     */
    protected refCount: AutomaticValue<number> = new AutomaticValue<number>(0);

    // REGION ENDED <Member Variable>

    // REGION START <protected>

    /**
     * 增加页面被引用次数
     */
    protected addRef() {
        this.refCount.value++;
        this.d(`次数 ${this.refCount.value}`);
    }

    /**
     * 减少页面被引用次数
     * - 当数量 `<=0` 时，才允许关闭页面
     */
    protected decRef() {
        this.refCount.value--;
        this.d(`次数 ${this.refCount.value}`);
        if (this.refCount.value <= 0) {
            this.close();
            this.refCount.value = 0;
        }
    }

    // REGION ENDED <protected>
}
