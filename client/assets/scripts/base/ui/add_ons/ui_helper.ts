import { Node, Button, Component, EventHandler, Constructor, UITransform, rect, game } from "cc";

/**
 * 在节点上部署组件
 * @param target 节点
 * @param component 组件
 * @returns
 */
export function setupComponent<T extends Component>(target: Node, component: Constructor<T>): T {
    return target.getComponent(component) || target.addComponent(component);
}

/**
 * 给按钮添加点击事件
 * @param btn               按钮组件
 * @param target            指定目标节点
 * @param component         指定组件名称
 * @param handler           回调方法名称
 * @param customEventData   携带的自定义数据
 * @returns 如果添加成功返回 `true` ，否则返回 `false`
 */
export function addClickHandler(
    btn: Button,
    target: Node,
    component: string,
    handler: string,
    customEventData: string = ""
) {
    const index = btn.clickEvents.findIndex((v) => {
        return (
            v.target === target &&
            v.component === component &&
            v.handler === handler &&
            v.customEventData === customEventData
        );
    });
    if (index === -1) {
        const clicked = new EventHandler();
        clicked.component = component;
        clicked.target = target;
        clicked.handler = handler;
        clicked.customEventData = customEventData;
        btn.clickEvents.push(clicked);
        return true;
    }
    return false;
}

/**
 * 部署默认的资源包
 * @param info 资源信息
 */
export function setupDefaultBundle(info: { [key: string]: any; bundle?: string }) {
    if (!Object.isFrozen(info)) {
        info.bundle = info.bundle || "resources";
    }
    return info;
}

/**
 * 获得指定节点的 UITransform 组件
 * @param node 指定节点
 * @returns
 */
export function getUiTransformOf(node: Node) {
    return setupComponent(node, UITransform);
}

/**
 * 获得指定节点的世界包围盒
 * @param node 当前节点
 * @param project 投射节点
 * @returns
 */
export function getWorldBoundindBoxOf(node: Node, project: Node) {
    const nui = getUiTransformOf(node);
    const np = nui.convertToWorldSpaceAR(project.position);
    return rect(np.x - nui.width * 0.5, np.y - nui.height * 0.5, nui.width, nui.height);
}

/**
 * 每帧消耗的时间
 */
export const TimeOfPerFrame = 1.0 / (game.frameRate as number);
