import { runInSandbox } from "../func/utils";

/**
 * 红点表现形式
 */
export enum E_RedDotStyle {
    Pure = 0,
    Number = 1,
}

/**
 * 红点表现组件
 */
export interface I_RedDotCom {
    refresh(r: RedDotNode): void;
}

/**
 * 红点树节点基类
 */
export abstract class RedDotNode {
    // 名称
    protected _id: string = "";
    // 表现形式
    protected _style: E_RedDotStyle = E_RedDotStyle.Pure;
    // 数量
    protected _num: number = 0;
    // 开关
    protected _on: boolean = false;
    // 子节点
    protected _children: RedDotNode[] = [];
    // 父节点
    protected _parent: RedDotNode = null;
    // 是否根节点
    protected _root: boolean = false;
    // 是否叶子节点
    protected _leaf: boolean = false;
    // 回调
    protected _reds: I_RedDotCom[] = [];

    constructor(id: string, style: E_RedDotStyle, leaf: boolean) {
        this._id = id;
        this._style = style;
        this._leaf = leaf;
    }

    /**
     * 红点 id
     */
    public get id() {
        return this._id;
    }

    /**
     * 红点表现形式
     */
    public get style() {
        return this._style;
    }

    /**
     * 红点开关
     * 用户应该使用此接口：hasRed
     */
    protected get on() {
        return this._on;
    }

    /**
     * 持有红点数量
     */
    public getNumber() {
        return this._num;
    }

    /**
     * 是否叶子节点
     */
    public get leaf() {
        return this._leaf;
    }

    /**
     * 是否根节点
     */
    public get root() {
        return this._root;
    }

    /**
     * 是否枝干节点
     */
    public get tree() {
        return !this._leaf;
    }

    /**
     * 是否存在父节点
     * @returns
     */
    public hasParent() {
        return this._parent !== null;
    }

    /**
     * 从父节点上移除
     */
    public detach() {
        if (this._parent) {
            const index = this._parent._children.indexOf(this);
            if (index > -1) {
                this._parent._children.splice(index, 1);
                this._parent.refresh();
                this._parent = null;
            }
        }
    }

    /**
     * 红点路径
     */
    public get pathInSep(): string[] {
        let path = [];
        let node: RedDotNode = this;
        while (node) {
            path.unshift(node.id);
            node = node._parent;
        }
        return path;
    }

    /**
     * 红点路径
     */
    public get path() {
        return this.pathInSep.join("/");
    }

    /**
     * 挂载红点组件
     * @param f 红点组件
     */
    public connect(f: I_RedDotCom) {
        if (this._reds.indexOf(f) === -1) {
            this._reds.push(f);
            f.refresh(this);
        }
    }

    /**
     * 断开红点组件
     * @param f 红点组件
     */
    public disconnect(f: I_RedDotCom) {
        const i = this._reds.indexOf(f);
        i > -1 && this._reds.splice(i, 1);
    }

    /**
     * 断开所有红点组件
     */
    public disconnectAll() {
        this._reds.length = 0;
    }

    /**
     * 通知红点组件更新
     */
    public notify() {
        const self = this;
        runInSandbox({
            onExcute() {
                self._reds.forEach((v) => v && v.refresh(self));
            },
        });
    }

    /**
     * 设置父节点
     * - 只允许无父节点的节点使用
     * - 否则，请通过正常手段从父节点上删除后再调用
     * @param p 父节点
     */
    public setParent(p: RedDotNode) {
        if (!this._parent) {
            this._parent = p;
        }
    }

    /**
     * 是否存在红点
     */
    public abstract hasRed(): boolean;

    /**
     * 刷新红点表现
     */
    public abstract refresh(): void;
}

/**
 * 红点树枝干节点
 */
export class RedDotTreeNode extends RedDotNode {
    constructor(id: string, style: E_RedDotStyle) {
        super(id, style, false);
    }

    /**
     * 节点数量
     */
    public get childrenCount() {
        return this._children.length;
    }

    /**
     * 添加节点
     * @param node 节点
     * @returns
     */
    public append(node: RedDotNode) {
        if (node.hasParent() || node.root || this.hasChild(node.id)) return;
        this._children.push(node);
        node.setParent(this);
        this.refresh();
        return this;
    }

    /**
     * 根据id查找节点
     * @param id 节点id
     * @returns
     */
    public find(id: string) {
        return this._children.find((v) => v.id === id);
    }

    /**
     * 删除节点
     * @param i 节点索引
     */
    public take(i: number) {
        let node = this._children[i];
        if (node !== null) {
            node.detach();
            this.refresh();
        }
    }

    /**
     * 是否存在节点
     * @param id 节点id
     * @returns
     */
    public hasChild(id: string) {
        return this._children.some((v) => v.id === id);
    }

    public hasRed(): boolean {
        return this._children.some((v) => v.hasRed());
    }

    public refresh() {
        if (this._style === E_RedDotStyle.Pure) {
            this._on = this.hasRed();
            this.notify();
        } else if (this._style === E_RedDotStyle.Number) {
            let sum = 0;
            this._children.forEach((v) => {
                sum += v.getNumber();
            });
            this._num = sum;
            this.notify();
        }
        if (this.hasParent()) {
            this._parent.refresh();
        }
    }
}

/**
 * 红点树叶子节点
 */
export class RedDotLeafNode extends RedDotNode {
    constructor(id: string, style: E_RedDotStyle) {
        super(id, style, true);
    }

    public hasRed(): boolean {
        if (this._style === E_RedDotStyle.Pure) {
            return this._on;
        } else if (this._style === E_RedDotStyle.Number) {
            return this._num > 0;
        }
        return false;
    }

    public refresh() {
        this.notify();
        if (this.hasParent()) {
            this._parent.refresh();
        }
    }

    /**
     * 修改开关
     * @param o 开关
     */
    public setOn(o: boolean) {
        if (this._style === E_RedDotStyle.Pure) {
            if (this._on !== o) {
                this._on = o;
                this.refresh();
            }
        }
    }

    /**
     * 修改数量
     * @param n 数量
     */
    public setNumber(n: number) {
        if (this._style === E_RedDotStyle.Number) {
            n = Math.max(0, n | 0);
            if (this._num !== n) {
                this._num = n;
                this.refresh();
            }
        }
    }

    /**
     * 修改数量增量
     * @param n 增量
     */
    public addNumber(n: number) {
        this.setNumber(this._num + n);
    }
}

/**
 * 红点树根节点
 */
export class RedDotRootNode extends RedDotTreeNode {
    private _inited: boolean = false;
    private static _instance: RedDotRootNode = null;

    public static getInstance() {
        return (this._instance = this._instance || new RedDotRootNode());
    }

    private constructor() {
        super("Root", E_RedDotStyle.Pure);
    }

    /**
     * 初始化
     * @param id id
     * @param style 表现形式
     */
    public init(id: string, style: E_RedDotStyle) {
        if (!this._inited) {
            this._id = id;
            this._style = style;
            this._root = true;
        }
    }

    /**
     * 查找子节点
     * @param path 子节点路径
     * @returns
     */
    public seek(path: string) {
        let paths = path.split("/");
        let current: RedDotNode = this;
        let found = true;
        while (paths.length > 0) {
            let path = paths.shift();
            if (current.tree) {
                current = (current as RedDotTreeNode).find(path);
                if (!current) {
                    found = false;
                    break;
                }
            } else if (current.leaf) {
                if (path !== current.id || paths.length > 0) {
                    found = false;
                    break;
                }
            }
        }
        return found ? current : null;
    }
}
