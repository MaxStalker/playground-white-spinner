import { useEffect, useRef } from "react";
import { Howl } from "howler";

let sprite = {
  "s-0": [0, 800],
  "s-1": [1500, 700],
  "s-2": [3000, 500],
  "s-3": [4400, 600],
  "s-4": [5900, 600],
  "s-5": [8900, 400],
  "s-6": [13200, 400],
};

let sound = new Howl({
  src: ["different.mp3"],
  volume: 0.1,
  autoplay: false,
  loop: false,
  sprite,
});

sound.rate(1);

let outFrames = [
  { transform: "rotate(0)", easing: "ease-out" },
  { transform: "rotate(-2deg)", easing: "ease-out" },
  { transform: "rotate(90deg)", easing: "ease-out" },
];

let inFrames = [
  { transform: "rotate(-90deg)", easing: "ease-in-out" },
  { transform: "rotate(5deg)", easing: "ease-in-out" },
  { transform: "rotate(-2deg)", easing: "ease-in-out" },
  { transform: "rotate(0)", easing: "ease-in-out" },
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

function play(direction) {
  if (direction === "normal") {
    sound.play("s-1");
  } else {
    sound.play("s-3");
  }
  /*  console.log(direction);
  // const rate = direction === "normal" ? 1.2 : 1;
  // sound.rate(rate);
  const i = Math.floor(Math.random() * Object.keys(sprite).length);
  const spriteName = Object.keys(sprite)[i];
  sound.play(spriteName);*/
}

export default function Spinner() {
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
    // We can rotate spinner around different axis here
    // outRef.current.style.transformOrigin = `${direction === "normal" ? "" : "-"}90px center`;

    const total = items.length;

    if (!playing && total === 1) {
      playing = true;
      outRef.current
        .animate(halfOut, { ...options, direction })
        .finished.then(next);
      return;
    }

    outRef.current.textContent = items.shift();
    playing = true;
    const mul = Math.exp(total / 4);
    const duration = Math.max(50, 500 - 150 * mul);
    const clamped = Math.min(1000 / (duration + 100), 1);

    play(direction, duration);
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
        base.current.addEventListener(
          "wheel",
          function (e) {
            let direction = e.deltaY < 0 ? 1 : -1;
            shift(direction);
          },
          { passive: true },
        );
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
      {/* -------------  */}

      <div className="container">
        <div className="inner">
          <div className={"value"} ref={outRef}>
            {current}
          </div>
        </div>
      </div>

      {/* -------------  */}
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
