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
function createHmmNode(tag, props, ...children) {
    const element = document.createElement(tag);
    if (props != null) {
        const { $attrs, $children } = props, rest = __rest(props, ["$attrs", "$children"]);
        applyAttrs(element, rest);
        const subs = [];
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
                    let newHmmNode = next(value);
                    if (newHmmNode instanceof Node) {
                        const newChild = newHmmNode;
                        element.replaceChild(newChild, currentNode);
                        currentNode = newChild;
                    }
                    else if (currentNode instanceof Text) {
                        currentNode.textContent = String(newHmmNode);
                    }
                    else {
                        const newChild = document.createTextNode(String(newHmmNode));
                        element.replaceChild(newChild, currentNode);
                        currentNode = newChild;
                    }
                }));
            }, function children(from, next) {
                // TODO: figure out a way to track multiple children without an extra container
                // is there an html fragment?
            });
        }
    }
    if (children) {
        let frag = document.createDocumentFragment();
        for (const child of children) {
            if (child instanceof Node) {
                frag.appendChild(child);
            }
            else {
                console.warn(`Found non-node from hmm: ${child}`);
            }
        }
        element.appendChild(frag);
    }
    return element;
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
//# sourceMappingURL=createHmmNode.js.map