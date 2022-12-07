import { Node, Button, _decorator, EventTouch, UITransform, Animation, AnimationClip } from "cc";
import { i18nLabel } from "../../i18n/i18n_label";
import { Singletons } from "../../singletons";
import { addClickHandler } from "../add_ons/ui_helper";
import { CE_UI_Type, UiBase } from "../ui_base";
const { ccclass, property } = _decorator;

/**
 * Url      : db://assets/scripts/base/ui/ui_dialog_base.ts
 * Author   : reyn
 * Date     : Tue Dec 06 2022 16:11:35 GMT+0800 (中国标准时间)
 * Class    : UiDialogBase
 * Desc     :
 */
@ccclass("UiDialogBase")
export class UiDialogBase extends UiBase {
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

    /************************************************************
     * 基础事件
     ************************************************************/

    protected onLoad() {
        super.onLoad && super.onLoad();
        addClickHandler(this.uiBtnBack, this.node, "UiDialogBase", "onCloseBtnTriggered");
        if (this.uiWinAnim) {
            this.uiOpenAnimClip && this.uiWinAnim.addClip(this.uiOpenAnimClip);
            this.uiCloseAnimClip && this.uiWinAnim.addClip(this.uiCloseAnimClip);
            this.uiWinAnim.on(Animation.EventType.FINISHED, this.onWinAnimFinished, this);
        }
    }

    openTapListener(open: boolean) {
        if (open) {
            this.node.on(Node.EventType.TOUCH_END, this.onTapped, this);
        } else {
            this.node.off(Node.EventType.TOUCH_END, this.onTapped, this);
        }
    }

    protected onEnable() {
        this.openTapListener(false);
    }

    protected onDisable() {}

    protected onTapped(e: EventTouch) {
        const hitOnStart = this.uiMain.hitTest(e.getUIStartLocation());
        const hitOnEnded = this.uiMain.hitTest(e.getUILocation());
        if (!hitOnStart && !hitOnEnded && this.uiTapSpaceToClose) {
            this.playClose({ from: "Space.Tap" });
        }
    }

    public playOpen(...args: any[]) {
        // TODO 将部分回调从 UiStack 移到 UiBase
        if (this.uiWinAnim) {
            this.uiWinAnim.defaultClip = this.uiOpenAnimClip;
            this.uiWinAnim.play(this.uiOpenAnimClip.name);
        } else {
            this.openTapListener(true);
        }
    }

    public playClose(...args: any[]) {
        this.openTapListener(false);
        if (this.uiWinAnim) {
            this.uiWinAnim.defaultClip = this.uiCloseAnimClip;
            this.uiWinAnim.play(this.uiCloseAnimClip.name);
        } else {
            this.close();
        }
    }

    protected onWinAnimFinished() {
        if (this.uiWinAnim.defaultClip === this.uiOpenAnimClip) {
            this.openTapListener(true);
        } else {
            this.openTapListener(false);
            this.close();
        }
    }
}
