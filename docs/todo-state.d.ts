import { Behavior } from "behavior-state";
interface Todo {
    id: number;
    done: boolean;
    title: string;
}
export declare function createTodoState(initialTodos?: Todo[]): {
    $todos: import("behavior-state").ObservableList<Todo>;
    $todoInput: Behavior<string>;
    updateNewTodoInput(value: string): void;
    toggleTodo(id: number): void;
    deleteTodo(id: number): void;
    addTodo(): void;
};
export {};
//# sourceMappingURL=todo-state.d.ts.map