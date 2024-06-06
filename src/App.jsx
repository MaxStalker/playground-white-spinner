import { useEffect, useRef } from "react";
import { Howl } from "howler";

let sound = new Howl({
  src: ["./public/spin.mp3"],
  volume: 0.1,
  preload: true,
  html5: true,
});

let outFrames = [
  { transform: "rotate(0)", easing: "ease-out" },
  { transform: "rotate(-2deg)", easing: "ease-out" },
  { transform: "rotate(90deg)", easing: "ease-out" },
];

let inFrames = [
  { transform: "rotate(-90deg)" },
  { transform: "rotate(5deg)" },
  { transform: "rotate(-2deg)" },
  { transform: "rotate(0)" },
];

let fullSwing = [
  { transform: "rotate(-90deg)" },
  { transform: "rotate(90deg)", easing: "ease-out" },
];

let halfOut = outFrames;
let halfIn = inFrames;
let direction = "normal";

const options = {
  iterations: 1,
  iterationStart: 0,
  delay: 0,
  endDelay: 0,
  duration: 500,
  fill: "forwards",
  easing: "linear",
};

const items = [];
let playing = false;
let current = 42;

function App() {
  //const [current, setCurrent] = useState(35);
  const base = useRef(null);
  const registered = useRef(null);
  const outRef = useRef(null);

  // const secondRef = useRef(null)

  function shift(number) {
    if (number < 0) {
      halfOut = inFrames;
      halfIn = outFrames;
      direction = "reverse";
    } else {
      halfOut = outFrames;
      halfIn = inFrames;
      direction = "normal";
    }
    current += number;
    items.push(current);

    if (!playing) {
      next();
    } else {
      console.log("skip playback");
    }
  }

  function next() {
    outRef.current.style.transformOrigin = `${direction === "normal" ? "" : "-"}90px center`;
    const total = items.length;
    console.log("------------NEXT");
    console.log(playing, total);

    if (!playing && total === 1) {
      playing = true;
      outRef.current
        .animate(halfOut, { ...options, direction })
        .finished.then(next);
      return;
    } else {
      console.log("SKIPPED INITIAL");
    }

    outRef.current.textContent = items.shift();
    playing = true;
    const mul = Math.exp(total / 4);
    const duration = Math.max(50, 500 - 150 * mul);
    const clamped = Math.min(1000 / (duration + 100), 1);

    sound.rate(500 / duration);
    sound.play();
    outRef.current.style.filter = `blur(${Math.min(0, clamped - 1.5)}px)`;
    outRef.current.style.transform = `scaleY(${clamped})`;

    outRef.current
      .animate(items.length === 0 ? halfIn : fullSwing, {
        ...options,
        duration,
        direction,
      })
      .finished.then(() => {
        if (items.length > 0) {
          next();
        } else {
          playing = false;
        }
      });
  }

  useEffect(() => {
    if (base.current && outRef.current) {
      if (!registered.current) {
        console.log("register");
        base.current.addEventListener("wheel", function (e) {
          let direction = e.deltaY < 0 ? -1 : 1;
          shift(direction);
        });
        registered.current = true;
      }
    }
  }, [base.current, outRef.current]);

  return (
    <div className={"controls"} ref={base}>
      <button
        tabIndex={0}
        onClick={() => {
          shift(-1);
        }}
      >
        -
      </button>
      <div className="container">
        <div className="inner">
          <div className={"label"} ref={outRef}>
            42
          </div>
          {/*        <span className={"two"} ref={outRef}>35</span>*/}
        </div>
      </div>
      <button
        tabIndex={1}
        onClick={() => {
          shift(1);
        }}
      >
        +
      </button>
    </div>
  );
}

export default App;
