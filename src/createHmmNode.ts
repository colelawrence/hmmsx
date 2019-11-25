import { Observable, Subscription } from "rxjs";
import { Behavior, BehaviorArray, ObservableList} from "behavior-state";

interface CreateHmmNode {
  (tag: keyof Hmm.HmmHTML, props: any, ...children: Hmm.HmmNode[]): Hmm.HmmNode;
  <T>(
    tag: Observable<T>,
    props: { next: (value: T) => Hmm.HmmNode }
  ): Hmm.HmmNode;
}

declare module "rxjs" {
  export interface Observable<T> {
    jsx: (props: { next: (value: T) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
  export interface BehaviorSubject<T> {
    jsx: (props: { next: (value: T) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
}

declare module "behavior-state/Behavior" {
  export interface Behavior<T> {
    jsx: (props: { next: (value: T) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
}
declare module "behavior-state/BehaviorArray" {
  export interface BehaviorArray<E> {
    jsx: (props: { next: (value: E[]) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
}
declare module "behavior-state/BehaviorList" {
  export interface ObservableList<E> {
    jsx: (props: { nextItem: (value: E) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
  export interface IObservableList<E> {
    jsx: (props: { nextItem: (value: E) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
  export interface BehaviorList<E> {
    jsx: (props: { nextItem: (value: E) => Hmm.HmmNode }) => Hmm.HmmNode;
  }
}

export let hmm: CreateHmmNode;
// @ts-ignore
createHmmNode = (tag, props, ...children) => {
  const element = document.createElement(tag) as HTMLElement;

  if (props != null) {
    const { $attrs, $style, $children, ...rest } = props;
    applyAttrs(element, rest);

    const subs: Subscription[] = [];
    if ($style) {
      ($style as Hmm.CreateRxStyle)(function style(from, next) {
        subs.push(
          from.subscribe(value => {
            Object.assign(element.style, next(value));
          })
        );
      });
    }

    if ($attrs) {
      ($attrs as Hmm.CreateRxAttrs<unknown>)(function attrs(from, next) {
        subs.push(
          from.subscribe(value => {
            applyAttrs(element, next(value));
          })
        );
      });
    }

    if ($children) {
      ($children as Hmm.CreateRxChildren<unknown>)(
        function child(from, next) {
          let currentNode: Node = element.appendChild(
            document.createComment(`child ${subs.length}`)
          );
          subs.push(
            from.subscribe(value => {
              let newHmmNode = next(value);
              if (newHmmNode instanceof Node) {
                const newChild = newHmmNode;
                element.replaceChild(newChild, currentNode);
                currentNode = newChild;
              } else if (newHmmNode instanceof Array) {
                const childContainer = appendAll(newHmmNode);
                const newChild = document.createElement("hmm-child");
                newChild.appendChild(childContainer);
                element.replaceChild(newChild, currentNode);
                currentNode = newChild;
              } else if (currentNode instanceof Text) {
                currentNode.textContent = String(newHmmNode);
              } else {
                const newChild = document.createTextNode(String(newHmmNode));
                element.replaceChild(newChild, currentNode);
                currentNode = newChild;
              }
            })
          );
        },
        function children(from, next) {
          let currentNode: Node = element.appendChild(
            document.createElement(`hmm-list`)
          );
          subs.push(
            from.subscribe(order => {
              // order.map()
              // todo...
            })
          );
        }
      );
    }
  }

  if (children) {
    element.appendChild(appendAll(children));
  }

  return element;
};

function appendAll(
  children: Hmm.HmmNode[],
  frag: Node = document.createDocumentFragment()
) {
  for (const child of children) {
    if (child instanceof Node) {
      frag.appendChild(child);
    } else if (child instanceof Array) {
      // probably want to do that keying thing here...
      appendAll(child, frag);
    } else if (typeof child === "object" || typeof child === "function") {
      console.warn(`Found non-node from hmm: ${child}`);
    } else if (child) {
      frag.appendChild(document.createTextNode(String(child)));
    }
  }
  return frag;
}

function applyAttrs(element: HTMLElement, { style, ...props }: any) {
  if (style) {
    Object.assign(element.style, style);
  }

  for (const key in props) {
    const fn = props[key] as Function;
    if (key.startsWith("on")) {
      if (key.endsWith("Capture")) {
        //@ts-ignore
        element[key.slice(0, -7).toLowerCase()] = function(
          this: any,
          evt: any
        ) {
          evt && evt.stopPropagation();
          fn.apply(this, arguments);
        };
      } else {
        //@ts-ignore
        element[key.toLowerCase()] = fn;
      }
    } else {
      //@ts-ignore
      element[key] = props[key];
    }
  }
}
