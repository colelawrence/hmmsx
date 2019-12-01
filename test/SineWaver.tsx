import { d, Fragment } from "../src";

import { Behavior } from "behavior-state";
import { distinctUntilChanged, map } from "rxjs/operators";

/** creates a controllable incrementing number */
function createGenerator(
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

export function SineWaver() {
  const sineWave = createGenerator(0.05, 17, n => Math.sin(n));

  return (
    <Fragment>
      <a
        style={{ fontFamily: "monospace" }}
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
    </Fragment>
  );
}
