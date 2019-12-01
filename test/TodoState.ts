import { BehaviorList, Behavior } from "../src";
import { combineLatest } from "rxjs";
import { debounceTime } from "rxjs/operators";

interface Todo {
  id: number;
  done: boolean;
  title: string;
}

const debug = console.log.bind(console, "%cTodoState", "color: dodgerblue");

const todos = [
  createTodo("Build UI for TodoApp", true),
  createTodo("Toggling a Todo"),
  createTodo("Deleting a Todo"),
  createTodo("Performant lists", true),
  createTodo("Adding a Todo")
];

function createTodo(title: string, done: boolean = false) {
  return {
    id: Math.random(),
    title,
    done
  };
}

function createSessionState<T>(
  key: string,
  orDefault: T
): [T, (update: T) => T] {
  return [
    (JSON.parse(sessionStorage.getItem(key) || "0") as T | 0) || orDefault,
    updated => {
      sessionStorage.setItem(key, JSON.stringify(updated));
      return updated;
    }
  ];
}

export function createTodoState(initialTodos: Todo[] = todos) {
  const [initSess, updateSess] = createSessionState("dotjsx-example-todos", {
    todos: initialTodos,
    input: ""
  });
  const $todos = new BehaviorList(initSess.todos);
  const $todoInput = new Behavior(initSess.input);

  combineLatest($todos.asObservable(), $todoInput)
    .pipe(debounceTime(500))
    .subscribe(([todos, input]) => updateSess({ todos, input }));

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
