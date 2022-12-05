import SingletonBase from "../singleton_base";
import { E_RedDotStyle, RedDotLeafNode, RedDotRootNode, RedDotTreeNode } from "./red_dot_tree";

/**
 * Url      : db://assets/scripts/base/red/red_mgr.ts
 * Author   : reyn
 * Date     : Thu Dec 01 2022 20:42:56 GMT+0800 (中国标准时间)
 * Class    : RedDotMgr
 * Desc     : 红点管理器
 */
export class RedDotMgr extends SingletonBase {
    // 根
    public root: RedDotRootNode = null;
    // 根->菜单
    public root_menu: RedDotTreeNode = null;
    // 菜单->邮箱
    public menu_mail: RedDotTreeNode = null;
    // 邮箱->系统消息
    public mail_system: RedDotLeafNode = null;
    // 邮箱->私聊消息
    public mail_private: RedDotLeafNode = null;

    /**
     * 初始化
     * - // 建议——在此构建红点树
     */
    onInitialize() {
        // For test
        this.root = RedDotRootNode.getInstance();
        this.root_menu = new RedDotTreeNode("Menu", E_RedDotStyle.Pure);
        this.menu_mail = new RedDotTreeNode("Mail", E_RedDotStyle.Number);
        this.mail_system = new RedDotLeafNode("System", E_RedDotStyle.Number);
        this.mail_private = new RedDotLeafNode("Private", E_RedDotStyle.Number);
        this.root.init("Root", E_RedDotStyle.Pure);
        this.root.append(this.root_menu);
        this.root_menu.append(this.menu_mail);
        this.menu_mail.append(this.mail_system);
        this.menu_mail.append(this.mail_private);

        this.mail_system.setNumber(3);
        this.mail_private.setNumber(2);
    }

    protected onDestroy(): void {
        this.mail_private.disconnectAll();
        this.mail_system.disconnectAll();
        this.menu_mail.disconnectAll();
        this.root_menu.disconnectAll();
        this.root.disconnectAll();
    }
}
