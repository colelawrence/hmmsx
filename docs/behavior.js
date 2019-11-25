"use strict";
class Behavior extends rxjs.BehaviorSubject {
}
/**
 * An extension of BehaviorSubject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 *
 * @class BehaviorArray<E>
 */
class BehaviorArray extends Behavior {
    constructor() {
        super(...arguments);
        /**
         * Add item to end of array and emit as next value (push)
         * @notes `this` is bounded
         */
        this.nextAppendItem = (item) => {
            this.next([...this.value, item]);
        };
        /**
         * Add to start of array and emit as next value (unshift)
         * @notes `this` is bounded
         */
        this.nextPrependItem = (item) => {
            this.next([item, ...this.value]);
        };
    }
    /**
     * Emits next value with items matching the given predicate removed.
     * @param shouldRemove return true for values that need to be removed
     */
    nextRemoveItemsWhere(shouldRemove) {
        this.next(this.value.filter(item => !shouldRemove(item)));
    }
    /**
     * Emits next value with items matching the given predicate retained.
     * @param shouldKeep return true for values that you want to keep in the next emitted array
     */
    nextRetainItemsWhere(shouldKeep) {
        this.next(this.value.filter(shouldKeep));
    }
    /**
     * @param shouldUpdate return true for values that you want to update using @param update in the next emitted array
     */
    nextUpdateItemsWhere(shouldUpdate, update) {
        this.next(this.value.map(item => {
            if (shouldUpdate(item)) {
                return update(item);
            }
            else {
                return item;
            }
        }));
    }
    /**
     * @param update each item
     */
    nextUpdateItems(update) {
        this.next(this.value.map(update));
    }
}
//# sourceMappingURL=behavior.js.map