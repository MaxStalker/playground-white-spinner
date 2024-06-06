import { useRef } from "react";

const first = [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }];
const second = [{ transform: "rotate(360deg)" }];

const items = [];
let playing = false;
let current = 42;

export default function SpinnerMk2() {
  const base = useRef(null);
  const rotator = useRef(null);

  const firstHalf = useRef(1);

  function shift(direction) {
    const animation = firstHalf.current > 0 ? first : second;
    console.log("shift!", animation);
    rotator?.current
      .animate(animation, {
        iterations: 1,
        duration: 500,
        // direction: "forwards",
        fill: "both",
        easing: "ease-in-out",
      })
      .finished.then(() => {
        firstHalf.current *= -1;
      });
  }

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
        <div className="inner" ref={rotator}>
          <div className={"value active"}>42</div>
          <div className={"value inactive"}>43</div>
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
