import React, {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

export const colors = [
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "fuchsia",
  "violet",
];

export interface Element {
  direction: [number, number];
  position: [number, number];
  color: string;
}

export const elementDiameter = 22;
const circleElementNumber = 51;
const intervalDuration = 20;
const directionMagnitude = 2.5;

export const Gameboard: FunctionComponent = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gravityOn, setGravityOn] = useState(false);
  const [spiralOn, setSpiralOn] = useState(false);

  const addElement: MouseEventHandler = (e) => {
    const angle = Math.random() * 2 * Math.PI;
    const newElement: Element = {
      direction: [
        Math.cos(angle) * directionMagnitude,
        Math.sin(angle) * directionMagnitude,
      ],
      position: [e.clientX, e.clientY],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setElements([...elements, newElement]);
  };

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        // spawn circleElementNumber elements with directions uniformly along a circle
        for (let i = 0; i < circleElementNumber; i++) {
          const angle = (i * 2 * Math.PI) / circleElementNumber;
          const newElement: Element = {
            direction: [
              Math.cos(angle) * directionMagnitude,
              Math.sin(angle) * directionMagnitude,
            ],
            position: [mousePosition.x, mousePosition.y],
            color: colors[Math.floor(Math.random() * colors.length)],
          };
          setElements((elements) => [...elements, newElement]);
        }
      } else if (e.key === "Enter") {
        // set all colors to blue
        setElements((elements) =>
          elements.map((element) => {
            return {
              ...element,
              color: "blue",
            };
          })
        );
      } else if (e.key === " ") {
        setGravityOn((g) => !g);
      } else if (e.key === "s") {
        setSpiralOn((s) => !s);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mousePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMousePosition((mousePosition) => {
        setElements((elements) =>
          elements.map((element) => {
            const [x, y] = element.position;
            const [dx, dy] = element.direction;
            const newX = Math.max(
              0,
              Math.min(x + dx, window.innerWidth - elementDiameter)
            );
            const newY = Math.max(
              0,
              Math.min(y + dy, window.innerHeight - elementDiameter)
            );
            // Bounce off the walls
            const bouncedX = x === newX && dx !== 0;
            const bouncedY = y === newY && dy !== 0;
            let gravityX = 0;
            let gravityY = 0;
            let gravityMagnitude = 0;
            if (gravityOn) {
              const mouseDiffX = mousePosition.x - x;
              const mouseDiffY = mousePosition.y - y;
              const distance = Math.sqrt(mouseDiffX ** 2 + mouseDiffY ** 2);
              gravityMagnitude = 0.1;
              gravityX =
                (mouseDiffX / (Math.pow(distance, 1.3) / 5 + 0.01)) *
                gravityMagnitude;
              gravityY =
                (mouseDiffY / (Math.pow(distance, 1.3) / 5 + 0.01)) *
                gravityMagnitude;
            }
            let directionMagnitude = 1 - gravityMagnitude * gravityMagnitude;
            const newDx = (bouncedX ? -dx : dx) * directionMagnitude + gravityX;
            const newDy = (bouncedY ? -dy : dy) * directionMagnitude + gravityY;
            return {
              ...element,
              color:
                bouncedX || bouncedY
                  ? colors[(colors.indexOf(element.color) + 1) % colors.length]
                  : element.color,
              position: [newX, newY],
              direction: [newDx, newDy],
            };
          })
        );
        return mousePosition;
      });
    }, intervalDuration);
    return () => clearInterval(interval);
  }, [gravityOn]);

  useEffect(() => {
    if (!spiralOn) return;
    const interval = setInterval(() => {
      setMousePosition((mousePosition) => {
        setElements((elements) => {
          // add an element with angle dependent on current time
          const angle = Date.now() / 200;
          const newElement: Element = {
            direction: [
              Math.cos(angle) * directionMagnitude,
              Math.sin(angle) * directionMagnitude,
            ],
            position: [mousePosition.x, mousePosition.y],
            color: colors[Math.floor(Math.random() * colors.length)],
          };
          return [...elements, newElement];
        });
        return mousePosition;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [spiralOn]);

  return (
    <div className="fixed h-screen bg-slate-800 w-screen" onClick={addElement}>
      {elements.map((element, index) => (
        <div
          key={index}
          className={"absolute rounded-full " + `bg-${element.color}-500`}
          style={{
            left: element.position[0],
            top: element.position[1],
            width: elementDiameter,
            height: elementDiameter,
          }}
        />
      ))}
      {elements.length === 0 && (
        <div className="text-center w-full h-full justify-center flex items-center text-slate-300">
          Click: spawn element <br />
          Tab: spawn circle <br />
          Enter: sync all colors <br />
          Space: toggle gravity
        </div>
      )}
    </div>
  );
};
