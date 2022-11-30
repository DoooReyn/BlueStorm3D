import { E_RedStyle, RedTree } from "./red_tree";

export class RedMgr {
    public root: RedTree = null;

    constructor() {
        this.root = new RedTree("Menu", E_RedStyle.Pure);
        console.log(this.root);
        const mail = this.root.append("Mail", E_RedStyle.Number);
        mail.append("System", E_RedStyle.Number);
        mail.append("Private", E_RedStyle.Number);
        this.init();
    }

    init() {
        this.root.seek("Mail/System").count = 3;
        this.root.seek("Mail/Private").count = 2;
    }
}
