import { Observable } from "rxjs";
interface CreateDotNode {
    (tag: keyof Dot.DotHTML, props: any, ...children: Dot.DotNode[]): Dot.DotNode;
    <T>(tag: Observable<T>, props: {
        next: (value: T) => Dot.DotNode;
    }): Dot.DotNode;
}
declare module "rxjs" {
    interface Observable<T> {
        jsx: (props: {
            next: (value: T) => Dot.DotNode;
        }) => Dot.DotNode;
    }
    interface BehaviorSubject<T> {
        jsx: (props: {
            next: (value: T) => Dot.DotNode;
        }) => Dot.DotNode;
    }
}
declare module "behavior-state/Behavior" {
    interface Behavior<T> {
        jsx: (props: {
            next: (value: T) => Dot.DotNode;
        }) => Dot.DotNode;
    }
}
declare module "behavior-state/BehaviorArray" {
    interface BehaviorArray<E> {
        jsx: (props: {
            next: (value: E[]) => Dot.DotNode;
        }) => Dot.DotNode;
    }
}
declare module "behavior-state/BehaviorList" {
    interface ObservableList<E> {
        jsx: (props: {
            nextItem: (value: E) => Dot.DotNode;
        }) => Dot.DotNode;
    }
    interface IObservableList<E> {
        jsx: (props: {
            nextItem: (value: E) => Dot.DotNode;
        }) => Dot.DotNode;
    }
    interface BehaviorList<E> {
        jsx: (props: {
            nextItem: (value: E) => Dot.DotNode;
        }) => Dot.DotNode;
    }
}
export declare let dot: CreateDotNode;
export {};
//# sourceMappingURL=createDotNode.d.ts.map
