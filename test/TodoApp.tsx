import { d, Fragment } from "../src";
import { createTodoState } from "./TodoState";
import { style } from "typestyle";

const styles = {
  todoList: style({
    maxWidth: "40em"
  }),
  todoItem: style({
    padding: `.5em`,
    cursor: "pointer",
    $nest: {
      "&:hover": {
        background: "#efefef"
      },
      button: {
        userSelect: "none",
        float: "right",
        cursor: "pointer"
      }
    }
  })
};

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
          $attrs={a => {
            a(state.$todoInput, v => ({ value: v }));
          }}
        />
        <button>Add Todo</button>
      </form>
    </Fragment>
  );
}

/** create function for listening to enter and click events */
function onEnterOrClick(fn: () => any) {
  return {
    tabIndex: 0,
    onClickCapture: () => fn(),
    onKeyDown: (evt: Dot.KeyboardEvent<any>) => {
      if (evt.key === "Enter") {
        evt.stopPropagation();
        evt.preventDefault();
        fn();
        return false;
      }
    }
  };
}
