// declare module "rxjs" {
//   interface Observable<T> {
//     map<E>(map: (val: T) => E): Observable<E>
//   }
// }

declare namespace rxjs {
  export * from "rxjs";

  export const operators: typeof import("rxjs/operators");
}
declare const rxjs: typeof import("rxjs") & {
  operators: typeof import("rxjs/operators");
};
