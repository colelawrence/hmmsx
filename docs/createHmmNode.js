"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
createDotNode = (tag, props, ...children) => {
    const element = document.createElement(tag);
    if (props != null) {
        const { $attrs, $style, $children } = props, rest = __rest(props, ["$attrs", "$style", "$children"]);
        applyAttrs(element, rest);
        const subs = [];
        if ($style) {
            $style(function style(from, next) {
                subs.push(from.subscribe(value => {
                    Object.assign(element.style, next(value));
                }));
            });
        }
        if ($attrs) {
            $attrs(function attrs(from, next) {
                subs.push(from.subscribe(value => {
                    applyAttrs(element, next(value));
                }));
            });
        }
        if ($children) {
            $children(function child(from, next) {
                let currentNode = element.appendChild(document.createComment(`child ${subs.length}`));
                subs.push(from.subscribe(value => {
                    let newDotNode = next(value);
                    if (newDotNode instanceof Node) {
                        const newChild = newDotNode;
                        element.replaceChild(newChild, currentNode);
                        currentNode = newChild;
                    }
                    else if (newDotNode instanceof Array) {
                        const childContainer = appendAll(newDotNode);
                        const newChild = document.createElement("dot-child");
                        newChild.appendChild(childContainer);
                        element.replaceChild(newChild, currentNode);
                        currentNode = newChild;
                    }
                    else if (currentNode instanceof Text) {
                        currentNode.textContent = String(newDotNode);
                    }
                    else {
                        const newChild = document.createTextNode(String(newDotNode));
                        element.replaceChild(newChild, currentNode);
                        currentNode = newChild;
                    }
                }));
            }, function children(from, next) {
                let currentNode = element.appendChild(document.createElement(`dot-list`));
                subs.push(from.subscribe(order => {
                    // order.map()
                    // todo...
                }));
            });
        }
    }
    if (children) {
        element.appendChild(appendAll(children));
    }
    return element;
};
function appendAll(children, frag = document.createDocumentFragment()) {
    for (const child of children) {
        if (child instanceof Node) {
            frag.appendChild(child);
        }
        else if (child instanceof Array) {
            // probably want to do that keying thing here...
            appendAll(child, frag);
        }
        else if (typeof child === "object" || typeof child === "function") {
            console.warn(`Found non-node from dot: ${child}`);
        }
        else if (child) {
            frag.appendChild(document.createTextNode(String(child)));
        }
    }
    return frag;
}
function applyAttrs(element, _a) {
    var { style } = _a, props = __rest(_a, ["style"]);
    if (style) {
        Object.assign(element.style, style);
    }
    for (const key in props) {
        const fn = props[key];
        if (key.startsWith("on")) {
            if (key.endsWith("Capture")) {
                //@ts-ignore
                element[key.slice(0, -7).toLowerCase()] = function (evt) {
                    evt && evt.stopPropagation();
                    fn.apply(this, arguments);
                };
            }
            else {
                //@ts-ignore
                element[key.toLowerCase()] = fn;
            }
        }
        else {
            //@ts-ignore
            element[key] = props[key];
        }
    }
}
//# sourceMappingURL=createDotNode.js.map
