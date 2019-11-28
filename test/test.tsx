import { Behavior } from "behavior-state";
import { distinctUntilChanged, map } from "rxjs/operators";
import { createHmmNode } from "../src/createHmmNode";
import { createTodoState } from "./todo-state";

function generator(
  step: number,
  ms: number,
  convert: (from: number) => number
) {
  const currentValue = new Behavior(0);
  const currentTimer = new Behavior(-1);
  return {
    toggle() {
      if (currentTimer.value > -1) {
        clearInterval(currentTimer.value);
        currentTimer.next(-1);
      } else {
        const stepFn = () => currentValue.next(currentValue.value + step);
        currentTimer.next(setInterval(stepFn, ms));
      }
    },
    $paused: currentTimer.pipe(
      map(timer => timer === -1),
      distinctUntilChanged()
    ),
    $values: currentValue.pipe(map(convert))
  };
}

function App(props: { fontSize: number }, ctx: Hmm.Ctx) {
  const sineWave = generator(0.05, 17, n => Math.sin(n));
  const state = createTodoState([{ id: 1, done: false, title: "Todo item" }]);

  return (
    <div onClick={() => console.log("hello")}>
      <div className="todo-list">
        <state.$todos.jsx
          nextItem={todo => (
            <div
              className="item"
              style={{
                textDecoration: todo.done ? "line-through" : "normal"
              }}
              onClickCapture={() => state.toggleTodo(todo.id)}
            >
              {todo.title}
              <button onClickCapture={() => state.deleteTodo(todo.id)}>
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
          onChange={evt => state.updateNewTodoInput(evt.target.value)}
          $attrs={a => {
            a(state.$todoInput, v => ({ value: v }))
          }}
        />
        <button>Add Todo</button>
      </form>
      <br />
      <a
        style={{ fontSize: props.fontSize, fontFamily: "monospace" }}
        onClick={() => {
          console.log("hello a");
        }}
        $style={style => {
          style(sineWave.$paused, paused => ({
            fontStyle: paused ? "italic" : "normal"
          }));
          style(sineWave.$values, val => ({
            color: `hsl(${val * 128 + 128}, 50%, 50%)`
          }));
        }}
        $children={child => {
          child(sineWave.$values, val =>
            `${val >= 0 ? "+" + val : val}00000`.slice(0, 7)
          );
        }}
      />
      <br />
      <button
        onClickCapture={sineWave.toggle}
        $children={child =>
          child(sineWave.$paused, paused => (paused ? "▶️ Play" : "⏸ Pause"))
        }
      />
    </div>
  );
}

document.getElementById("app")!.appendChild(App({ fontSize: 26 }, {}));

const a = <App fontSize={13} />;
<textarea cols={12} />;
