import { ObserverProps } from "./observer";
import { Observable } from "rxjs";
import { createDotNode } from "./createDotNode";

declare module "rxjs" {
  export interface Observable<T> {
    jsx: (props: ObserverProps<T>, context: Dot.Ctx) => Dot.DotNode;
  }
  export interface BehaviorSubject<T> {
    jsx: (props: ObserverProps<T>, context: Dot.Ctx) => Dot.DotNode;
  }
}

Object.defineProperty(Observable.prototype, "jsx", {
  get() {
    // We must use defineProperty in order to obtain the correct `this` context
    // the scope `this` binding here is critical to be able
    // createDotNode can accept an Observable
    return (props: any) => createDotNode(this, props);
  }
});
