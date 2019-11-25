import { Observable } from "rxjs";
interface CreateHmmNode {
    (tag: keyof Hmm.HmmHTML, props: any, ...children: Hmm.HmmNode[]): Hmm.HmmNode;
    <T>(tag: Observable<T>, props: {
        next: (value: T) => Hmm.HmmNode;
    }): Hmm.HmmNode;
}
declare module "rxjs" {
    interface Observable<T> {
        jsx: (props: {
            next: (value: T) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
    interface BehaviorSubject<T> {
        jsx: (props: {
            next: (value: T) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
}
declare module "behavior-state/Behavior" {
    interface Behavior<T> {
        jsx: (props: {
            next: (value: T) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
}
declare module "behavior-state/BehaviorArray" {
    interface BehaviorArray<E> {
        jsx: (props: {
            next: (value: E[]) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
}
declare module "behavior-state/BehaviorList" {
    interface ObservableList<E> {
        jsx: (props: {
            nextItem: (value: E) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
    interface IObservableList<E> {
        jsx: (props: {
            nextItem: (value: E) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
    interface BehaviorList<E> {
        jsx: (props: {
            nextItem: (value: E) => Hmm.HmmNode;
        }) => Hmm.HmmNode;
    }
}
export declare let hmm: CreateHmmNode;
export {};
//# sourceMappingURL=createHmmNode.d.ts.map