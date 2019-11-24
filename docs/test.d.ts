declare let direction: number;
declare const map: typeof import("rxjs/operators").map, distinctUntilChanged: typeof import("rxjs/operators").distinctUntilChanged;
declare function generator(step: number, ms: number, convert: (from: number) => number): {
    toggle(): void;
    $paused: import("rxjs").Observable<boolean>;
    $values: import("rxjs").Observable<number>;
};
declare function App(props: {
    fontSize: number;
}, ctx: Hmm.Ctx): JSX.Element;
//# sourceMappingURL=test.d.ts.map