import { Observable, observable, Subscription } from "rxjs";
import { ObserverProps } from "./observer";

const keySymbol = Symbol("dotjsx key");
const err = console.error.bind(console, "[DotJSX]");
const userWarning = console.warn.bind(console, "[DotJSX]");

declare global {
  interface HTMLElement {
    [keySymbol]?: symbol | string | number;
  }
}

type DotProps<P> = P & {
  key?: symbol | string | number;
};

interface CreateDotNode {
  (
    tag: "input",
    props?:
      | (Dot.InputHTMLAttributes<HTMLInputElement> &
          Dot.ClassAttributes<HTMLInputElement>)
      | null,
    ...children: Dot.DotNode[]
  ): Dot.DotNode;

  <P extends keyof Dot.DotHTML>(
    tag: P,
    ...params: Parameters<Dot.DotHTML[P]>
  ): Dot.DotNode;

  /** Observables can be used when called directly */
  <T>(tag: Observable<T>, props: DotProps<ObserverProps<T>>): Dot.DotNode;
}

class DotRenderingError extends Error {}

class Ctx {}

const ctx = new Ctx();

export function Fragment({ children }: any = {}, ctx: Ctx) {
  return appendAll(children || [])
}

export let createDotNode: CreateDotNode;
// @ts-ignore
createDotNode = (tag, props, ...children) => {
  let element: HTMLElement;
  const subs: Subscription[] = [];
  const sub = <T>(from: Observable<T>, next: (val: T) => any) =>
    subs.push(from.subscribe(next));
  switch (typeof tag) {
    case "function":
      return tag({ ...props, children }, ctx);
    case "string":
      element = document.createElement(tag) as HTMLElement;
      if (props != null) {
        const { $attrs, $style, $children, ...rest } = props;
        applyAttrs(element, rest);

        if ($style) {
          ($style as Dot.CreateRxStyle)(function style(from, next) {
            sub(from, value => {
              Object.assign(element.style, next(value));
            });
          });
        }

        if ($attrs) {
          ($attrs as Dot.CreateRxAttrs<unknown>)(function attrs(from, next) {
            sub(from, value => {
              applyAttrs(element, next(value));
            });
          });
        }

        if ($children) {
          ($children as Dot.CreateRxChildren<unknown>)(child, function children(
            from,
            next
          ) {
            userWarning("$children list is not yet implemented");
            /*
            let currentNode: Node = element.appendChild(
              document.createElement(`dot-list`)
            );
            sub(from, order => {
              // order.map()
              // todo...
            });
            */
          });
        }
      }

      if (children) {
        element.appendChild(appendAll(children));
      }
      break;
    case "object":
      if (tag[observable]) {
        element = document.createElement("dot-obs") as HTMLElement;
        child(tag, props.next);
        break;
      }
    default:
      throw new DotRenderingError(
        `Failed to 'createDotNode': The tag/component provided('${tag &&
          tag.toString()}') is not a valid component tag or function.`
      );
  }

  return element;

  function child<P>(from: Observable<P>, next: (value: P) => Dot.DotNode) {
    const placeholder = document.createComment(`placeholder ${subs.length}`);
    let currentNode: Node = element.appendChild(placeholder);
    sub(from, value => {
      let newDotNode = next(value);
      if (newDotNode instanceof Node) {
        const newChild = newDotNode;
        element.replaceChild(newChild, currentNode);
        currentNode = newChild;
      } else if (newDotNode instanceof Array) {
        const childContainer = appendAll(newDotNode);
        const newChild = document.createElement("dot-child");
        newChild.appendChild(childContainer);
        element.replaceChild(newChild, currentNode);
        currentNode = newChild;
      } else if (currentNode instanceof Text) {
        currentNode.textContent = String(newDotNode);
      } else if (newDotNode != null && newDotNode !== "") {
        const newChild = document.createTextNode(String(newDotNode));
        element.replaceChild(newChild, currentNode);
        currentNode = newChild;
      } else {
        element.replaceChild(placeholder, currentNode);
        currentNode = placeholder;
      }
    });
  }
};

/** Append all DotNodes to the fragment or provided element and return frag or provided element */
function appendAll(
  children: Dot.DotNode[],
  frag: Node = document.createDocumentFragment()
) {
  for (const child of children) {
    if (child instanceof Node) {
      frag.appendChild(child);
    } else if (child instanceof Array) {
      // probably want to do that keying thing here...
      appendAll(child, frag);
    } else if (typeof child === "object" || typeof child === "function") {
      err("appendAll found non-node", child);
    } else if (child) {
      frag.appendChild(document.createTextNode(String(child)));
    }
  }
  return frag;
}

function applyAttrs(element: HTMLElement, { style, children, ...props }: any) {
  if (style) {
    Object.assign(element.style, style);
  }

  if (children) {
    appendAll(children, element);
  }

  for (const key in props) {
    if (key.startsWith("on")) {
      const fn = props[key] as Function;
      expect(
        fn == null || typeof fn === "function",
        `event listener ('${key}') value is null or function, but found ('${fn &&
          fn.toString()}')`
      );
      if (key.endsWith("Capture")) {
        //@ts-ignore
        element[key.slice(0, -7).toLowerCase()] = function(
          this: any,
          evt: any
        ) {
          // the capture part
          evt && evt.stopPropagation();
          fn.apply(this, arguments);
        };
      } else {
        //@ts-ignore
        element[key.toLowerCase()] = fn;
      }
    } else {
      try {
        //@ts-ignore
        element[key] = props[key];
      } catch (error) {
        userWarning(`Failed to assign to ('${key}')`, error);
      }
    }
  }
}

class ExpectError extends Error {
  constructor(message: string) {
    super("Expected " + message);
  }
}

function expect(isTrue: boolean, message: string) {
  if (!isTrue) {
    throw new ExpectError(message);
  }
}
