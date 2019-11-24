function createHmmNode(
  tag: keyof Hmm.HmmHTML,
  props: any,
  ...children: Hmm.HmmNode[]
): Hmm.HmmNode {
  const element = document.createElement(tag) as HTMLElement;

  if (props != null) {
    const { $attrs, $children, ...rest } = props;
    applyAttrs(element, rest);

    const subs: rxjs.Subscription[] = [];
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
          // TODO: figure out a way to track multiple children without an extra container
          // is there an html fragment?
        }
      );
    }
  }

  if (children) {
    let frag = document.createDocumentFragment();
    for (const child of children) {
      if (child instanceof Node) {
        frag.appendChild(child);
      } else {
        console.warn(`Found non-node from hmm: ${child}`);
      }
    }
    element.appendChild(frag);
  }

  return element;
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
