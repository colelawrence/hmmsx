"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behavior_state_1 = require("behavior-state");
const operators_1 = require("rxjs/operators");
const createHmmNode_1 = require("./createHmmNode");
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
    return (createHmmNode_1.hmm("div", { onClick: () => console.log("hello") },
        createHmmNode_1.hmm("div", { className: "todo-list" },
            createHmmNode_1.hmm(state.$todos.jsx, { nextItem: todo => (createHmmNode_1.hmm("div", { className: "item", style: {
                        textDecoration: todo.done ? "line-through" : "normal"
                    }, onClickCapture: () => state.toggleTodo(todo.id) },
                    todo.title,
                    createHmmNode_1.hmm("button", { onClickCapture: () => state.deleteTodo(todo.id) }, "\uD83D\uDDD1"))) })),
        createHmmNode_1.hmm("form", { action: "#", onSubmitCapture: evt => {
                evt.preventDefault();
                state.addTodo();
            } },
            createHmmNode_1.hmm("input", { type: "text", onChange: evt => state.updateNewTodoInput(evt.target.value), "$attrs": a => a(state.$todoInput, v => ({ value: v })) }),
            createHmmNode_1.hmm("button", null, "Add Todo")),
        createHmmNode_1.hmm("br", null),
        createHmmNode_1.hmm("a", { style: { fontSize: props.fontSize, fontFamily: "monospace" }, onClick: () => {
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
        createHmmNode_1.hmm("br", null),
        createHmmNode_1.hmm("button", { onClickCapture: sineWave.toggle, "$children": child => child(sineWave.$paused, paused => (paused ? "▶️ Play" : "⏸ Pause")) })));
}
document.getElementById("app").appendChild(App({ fontSize: 26 }, {}));
const a = createHmmNode_1.hmm(App, { fontSize: 13 });
createHmmNode_1.hmm("textarea", { cols: 12 });
//# sourceMappingURL=test.js.map