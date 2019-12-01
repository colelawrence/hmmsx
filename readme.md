# dotjsx

Dotjsx is an experimental minimal web view framework that works closely with the HTML DOM.

It is based on strong principles of FRP while encouraging patterns of separation between view and state management.

###### Example: `TodoApp.tsx`
```tsx
import { d, Fragment } from "dotjsx";

// ...

export function TodoApp() {
  const state = createTodoState();

  return (
    <Fragment>
      <div className={styles.todoList}>
        <state.$todos.jsx
          nextItem={todo => (
            <div
              className={styles.todoItem}
              style={{
                textDecoration: todo.done ? "line-through" : "normal"
              }}
              {...onEnterOrClick(() => state.toggleTodo(todo.id))}
            >
              {todo.title}
              <button {...onEnterOrClick(() => state.deleteTodo(todo.id))}>
                🗑
              </button>
            </div>
          )}
        />
      </div>
      <form
        action="#"
        onSubmitCapture={evt => {
          evt.preventDefault();
          state.addTodo();
        }}
      >
        <input
          type="text"
          onInput={evt =>
            state.updateNewTodoInput((evt.target as HTMLInputElement).value)
          }
          // $attrs works for only HTML elements and enables you to directly set properties upon next values
          $attrs={a => {
            // a(obs of A, nextFunction(A) => Attrs)
            a(state.$todoInput, v => ({ value: v }));
          }}
        />
        <button>Add Todo</button>
      </form>
    </Fragment>
  );
}
```

###### Example: `TodoState.ts`
```ts
import { BehaviorList, Behavior } from "dotjsx";

export function createTodoState(initialTodos: Todo[] = todos) {
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
```
