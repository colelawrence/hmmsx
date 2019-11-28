import { BehaviorArray, Behavior, BehaviorList } from "behavior-state";

interface Todo {
  id: number;
  done: boolean;
  title: string;
}

const debug = console.log.bind(console, "%cTodoState", "color: dodgerblue");

export function createTodoState(initialTodos: Todo[] = []) {
  const $todos = new BehaviorList(initialTodos);
  const $todoInput = new Behavior("");

  return {
    $todos: $todos.asObservableList(),
    $todoInput,
    updateNewTodoInput(value: string) {
      debug("updateNewTodoInput", value);
      $todoInput.next(value);
    },
    toggleTodo(id: number) {
      debug("toggleTodo", id);
      $todos.nextUpdateItemsWhere(
        todo => todo.id === id,
        todo => ({ ...todo, done: !todo.done })
      );
    },
    deleteTodo(id: number) {
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
