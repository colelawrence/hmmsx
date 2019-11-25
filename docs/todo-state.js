"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behavior_state_1 = require("behavior-state");
const debug = console.log.bind(console, "%cTodoState", "color: dodgerblue");
function createTodoState(initialTodos = []) {
    const $todos = new behavior_state_1.BehaviorList(initialTodos);
    const $todoInput = new behavior_state_1.Behavior("");
    return {
        $todos: $todos.asObservableList(),
        $todoInput,
        updateNewTodoInput(value) {
            debug("updateNewTodoInput", value);
            $todoInput.next(value);
        },
        toggleTodo(id) {
            debug("toggleTodo", id);
            $todos.nextUpdateItemsWhere(todo => todo.id === id, todo => (Object.assign(Object.assign({}, todo), { done: !todo.done })));
        },
        deleteTodo(id) {
            debug("deleteTodo", id);
            $todos.nextRemoveItemsWhere(todo => todo.id === id);
        },
        addTodo() {
            if ($todoInput.value) {
                debug("addTodo", $todoInput.value);
                $todos.nextAppendItem({
                    id: Math.random(),
                    done: false,
                    title: $todoInput.value
                });
                $todoInput.next("");
            }
        }
    };
}
exports.createTodoState = createTodoState;
//# sourceMappingURL=todo-state.js.map