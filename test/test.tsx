import { d } from "../src";
import { TodoApp } from "./TodoApp";
import { SineWaver } from "./SineWaver";

function App() {
  return (
    <div>
      <TodoApp />
      <br />
      <SineWaver />
    </div>
  );
}

document.getElementById("app")!.appendChild(<App fontSize={26} />);
