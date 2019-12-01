export type ObserverProps<T> = (T extends string | number | Dot.DotNode
  ? {
      /** next is optional if we can easily render your component as a simple string / number */
      next?: (value: T) => Dot.DotNode;
    }
  : {
      next: (value: T) => Dot.DotNode;
    }) & {
  complete?: () => Dot.DotNode;
};

export type ObserverListProps<E> = E extends string | number | Dot.DotNode
  ? {
      /** nextItem is optional if we can easily render your component as a simple string / number */
      nextItem?: (value: E) => Dot.DotNode;
    }
  : {
      nextItem: (value: E) => Dot.DotNode;
    };

/** Observer function component */
export type ObserverFC<T> = (
  props: ObserverProps<T>,
  context: Dot.Ctx
) => Dot.DotNode;

/** Observer function component */
export type ObserverListFC<T> = (
  props: ObserverListProps<T>,
  context: Dot.Ctx
) => Dot.DotNode;
