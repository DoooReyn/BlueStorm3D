import RedDot from "../../scene/red/red_dot";

export enum E_RedStyle {
    Pure = 0,
    Number = 1,
}

export type T_RedCallback = (node: RedTree) => void;

export class RedTree {
    public parent: RedTree = null;
    protected _children: RedTree[] = [];
    protected _name: string = "";
    protected _count: number = 0;
    protected _style: E_RedStyle = E_RedStyle.Pure;
    protected _reds: RedDot[] = [];

    public constructor(name: string, style: E_RedStyle) {
        this._name = name;
        this._style = style;
    }

    public get style() {
        return this._style;
    }

    public get count() {
        return this._count;
    }

    public get name() {
        return this._name;
    }

    public get on() {
        return this._count > 0;
    }

    public set count(c: number) {
        if (this._children.length === 0) {
            if (this._style === E_RedStyle.Number) {
                this._count = Math.max(0, c | 0);
            }
        } else {
            this._count = this._children.reduce((s, v) => s + v.count, 0);
        }
        if (this.parent) {
            this.parent.count = 0;
        }
        this.refresh();
    }

    protected refresh() {
        this._reds.forEach((v) => v.refresh(this));
        if (this.parent) {
            this.parent.refresh();
        }
    }

    public append(name: string, style: E_RedStyle) {
        if (this._children.findIndex((c) => c._name === name) === -1) {
            let node = new RedTree(name, style);
            this._children.push(node);
            node.parent = this;
            return node;
        }
    }

    public seek(name: string) {
        if (name == this._name) {
            return this;
        }
        const paths = name.split("/");
        let node: RedTree = this;
        for (let i = 0; i < paths.length; i++) {
            node = node._children.find((c) => c._name === paths[i]);
            if (!node) return null;
        }
        return node;
    }

    public take(name: string) {
        const index = this._children.findIndex((c) => c._name === name);
        if (index > -1) {
            const node = this._children[index];
            node.parent = null;
            this._children.splice(index, 1);
        }
    }

    public connect(f: RedDot) {
        if (this._reds.indexOf(f) === -1) {
            this._reds.push(f);
            this.refresh();
        }
    }

    public disconnect(f: RedDot) {
        const i = this._reds.indexOf(f);
        if (i > -1) {
            this._reds.splice(i, 1);
        }
    }
}
