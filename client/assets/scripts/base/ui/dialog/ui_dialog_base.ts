import { Node, Button, _decorator, EventTouch, UITransform, Animation, AnimationClip } from "cc";
import { AutomaticValue } from "../../func/automatic_value";
import { i18nLabel } from "../../i18n/i18n_label";
import { addClickHandler } from "../add_ons/ui_helper";
import { CE_UI_Type } from "../ui_base";
import { UiDisableTouch } from "../ui_disable_touch";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_dialog_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:35 GMT+0800 (中国标准时间)
 * Class    : UiDialogBase
 * Desc     : Dialog 页面基类
 * - 一般指弹窗
 */
@ccclass("ui_dialog_base")
export class UiDialogBase extends UiDisableTouch {
    // REGION START <Member Variables>

    @property({ displayName: "UI类型", type: CE_UI_Type, override: true, readonly: true })
    uiType = CE_UI_Type.Dialog;

    @property({ displayName: "关闭按钮", type: Button })
    uiBtnBack: Button = null;

    @property({ displayName: "标题文本", type: i18nLabel })
    uiLabTitle: i18nLabel = null;

    @property({ displayName: "弹窗主体", type: UITransform })
    uiMain: UITransform = null;

    @property({ displayName: "窗体动画", type: Animation })
    uiWinAnim: Animation = null;

    @property({ displayName: "动画剪辑-窗体打开", type: AnimationClip })
    uiOpenAnimClip: AnimationClip = null;

    @property({ displayName: "动画剪辑-窗体关闭", type: AnimationClip })
    uiCloseAnimClip: AnimationClip = null;

    @property({ displayName: "点击空白处关闭" })
    uiTapSpaceToClose: boolean = false;

    /**
     * 窗体动画状态标识
     */
    protected _winAniFlag: AutomaticValue<boolean> = new AutomaticValue<boolean>(false);

    // REGION ENDED <Member Variables>

    // REGION START <protected>

    protected onLoad() {
        super.onLoad && super.onLoad();
        addClickHandler(this.uiBtnBack, this.node, "UiDialogBase", "onCloseBtnTriggered");
        if (this.uiWinAnim) {
            this.uiOpenAnimClip && this.uiWinAnim.addClip(this.uiOpenAnimClip);
            this.uiCloseAnimClip && this.uiWinAnim.addClip(this.uiCloseAnimClip);
        }
    }

    protected onEnable() {
        super.onEnable && super.onEnable();
        this.node.on(Node.EventType.TOUCH_END, this.onTapped, this);
    }

    protected onDisable() {
        super.onDisable && super.onDisable();
        this.node.off(Node.EventType.TOUCH_END, this.onTapped, this);
    }

    /**
     * 页面点击事件
     * - 在此实现 **点击窗体外部关闭** 功能
     * @param e 触摸事件
     * @returns
     */
    protected onTapped(e: EventTouch) {
        if (this._winAniFlag.value) {
            this.d(`窗体动画正在播放中，请稍候`);
            return;
        }
        const hitOnStart = this.uiMain.hitTest(e.getUIStartLocation());
        const hitOnEnded = this.uiMain.hitTest(e.getUILocation());
        if (!hitOnStart && !hitOnEnded && this.uiTapSpaceToClose) {
            this.playClose({ from: "Space.Tap" });
        }
    }

    /**
     * 窗口打开动画开始回调
     * @param args 参数列表
     */
    protected onWinOpenAnimStarted(...args: any) {
        this.d(`窗体打开动画开始`, ...args);
        this._winAniFlag.value = true;
    }

    /**
     * 窗口打开动画结束回调
     * @param args 参数列表
     */
    protected onWinOpenAnimFinished(...args: any) {
        this.d(`窗体打开动画结束`, ...args);
        this._winAniFlag.value = false;
    }

    /**
     * 窗口关闭动画开始回调
     * @param args 参数列表
     */
    protected onWinCloseAnimStarted(...args: any) {
        this.d(`窗体关闭动画开始`, ...args, this);
        this._winAniFlag.value = true;
    }

    /**
     * 窗口关闭动画结束回调
     * @param args 参数列表
     */
    protected onWinCloseAnimFinished(...args: any) {
        this.d(`窗体关闭动画结束`, ...args);
        this._winAniFlag.value = false;
        this.close();
    }

    // REGION ENDED <protected>

    // REGION START <public>
    public playOpen(...args: any[]) {
        if (this.uiWinAnim) {
            this.uiWinAnim.once(Animation.EventType.PLAY, () => this.onWinOpenAnimStarted(...args), this);
            this.uiWinAnim.once(Animation.EventType.FINISHED, () => this.onWinOpenAnimFinished(...args), this);
            this.uiWinAnim.play(this.uiOpenAnimClip.name);
        }
    }

    public playClose(...args: any[]) {
        if (this.uiWinAnim) {
            this.uiWinAnim.once(Animation.EventType.PLAY, () => this.onWinCloseAnimStarted(...args), this);
            this.uiWinAnim.once(Animation.EventType.FINISHED, () => this.onWinCloseAnimFinished(...args), this);
            this.uiWinAnim.play(this.uiCloseAnimClip.name);
        } else {
            this.close();
        }
    }

    // REGION ENDED <public>
}
