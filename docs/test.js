"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behavior_state_1 = require("behavior-state");
const operators_1 = require("rxjs/operators");
const createDotNode_1 = require("./createDotNode");
const todo_state_1 = require("./todo-state");
function generator(step, ms, convert) {
    const currentValue = new behavior_state_1.Behavior(0);
    const currentTimer = new behavior_state_1.Behavior(-1);
    return {
        toggle() {
            if (currentTimer.value > -1) {
                clearInterval(currentTimer.value);
                currentTimer.next(-1);
            }
            else {
                const stepFn = () => currentValue.next(currentValue.value + step);
                currentTimer.next(setInterval(stepFn, ms));
            }
        },
        $paused: currentTimer.pipe(operators_1.map(timer => timer === -1), operators_1.distinctUntilChanged()),
        $values: currentValue.pipe(operators_1.map(convert))
    };
}
function App(props, ctx) {
    const sineWave = generator(0.05, 17, n => Math.sin(n));
    const state = todo_state_1.createTodoState([{ id: 1, done: false, title: "Todo item" }]);
    return (createDotNode_1.dot("div", { onClick: () => console.log("hello") },
        createDotNode_1.dot("div", { className: "todo-list" },
            createDotNode_1.dot(state.$todos.jsx, { nextItem: todo => (createDotNode_1.dot("div", { className: "item", style: {
                        textDecoration: todo.done ? "line-through" : "normal"
                    }, onClickCapture: () => state.toggleTodo(todo.id) },
                    todo.title,
                    createDotNode_1.dot("button", { onClickCapture: () => state.deleteTodo(todo.id) }, "\uD83D\uDDD1"))) })),
        createDotNode_1.dot("form", { action: "#", onSubmitCapture: evt => {
                evt.preventDefault();
                state.addTodo();
            } },
            createDotNode_1.dot("input", { type: "text", onChange: evt => state.updateNewTodoInput(evt.target.value), "$attrs": a => a(state.$todoInput, v => ({ value: v })) }),
            createDotNode_1.dot("button", null, "Add Todo")),
        createDotNode_1.dot("br", null),
        createDotNode_1.dot("a", { style: { fontSize: props.fontSize, fontFamily: "monospace" }, onClick: () => {
                console.log("hello a");
            }, "$style": style => {
                style(sineWave.$paused, paused => ({
                    fontStyle: paused ? "italic" : "normal"
                }));
                style(sineWave.$values, val => ({
                    color: `hsl(${val * 128 + 128}, 50%, 50%)`
                }));
            }, "$children": child => {
                child(sineWave.$values, val => `${val >= 0 ? "+" + val : val}00000`.slice(0, 7));
            } }),
        createDotNode_1.dot("br", null),
        createDotNode_1.dot("button", { onClickCapture: sineWave.toggle, "$children": child => child(sineWave.$paused, paused => (paused ? "▶️ Play" : "⏸ Pause")) })));
}
document.getElementById("app").appendChild(App({ fontSize: 26 }, {}));
const a = createDotNode_1.dot(App, { fontSize: 13 });
createDotNode_1.dot("textarea", { cols: 12 });
//# sourceMappingURL=test.js.map
