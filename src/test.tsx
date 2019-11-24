let direction = 1;

const { map, distinctUntilChanged } = rxjs.operators;

function generator(
  step: number,
  ms: number,
  convert: (from: number) => number
) {
  const currentValue = new rxjs.BehaviorSubject(0);
  const currentTimer = new rxjs.BehaviorSubject(-1);
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
  const sineWave = generator(0.5, 1000, n => Math.sin(n));

  return (
    <div onClick={() => console.log("hello")}>
      <a
        style={{ fontSize: props.fontSize }}
        onClick={() => {
          console.log("hello a");
        }}
        $attrs={attrs => {
          attrs(sineWave.$values, val => ({
            style: { color: `hsl(${val * 128 + 128}, 50%, 50%)` },
            href: `#clicked-on=${val}`
          }));
        }}
        $children={child => {
          child(sineWave.$values, val => `${val}0000`.slice(0, 7));
        }}
      />
      <br/>
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
