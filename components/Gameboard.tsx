import React, {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

const colors = [
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "fuchsia",
  "violet",
];

interface Element {
  direction: [number, number];
  position: [number, number];
  color: string;
}

const elementSize = 22;
const circleElementNumber = 51;
const intervalDuration = 20;
const directionMagnitude = 2.5;

export const Gameboard: FunctionComponent = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      setElements((elements) =>
        elements.map((element) => {
          const [x, y] = element.position;
          const [dx, dy] = element.direction;
          const newX = Math.max(
            0,
            Math.min(x + dx, window.innerWidth - elementSize)
          );
          const newY = Math.max(
            0,
            Math.min(y + dy, window.innerHeight - elementSize)
          );
          // Bounce off the walls
          const bouncedX = x === newX && dx !== 0;
          const bouncedY = y === newY && dy !== 0;
          const newDx = bouncedX ? -dx : dx;
          const newDy = bouncedY ? -dy : dy;
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
    }, intervalDuration);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed h-screen bg-slate-800 w-screen" onClick={addElement}>
      {elements.map((element, index) => (
        <div
          key={index}
          className={"absolute rounded-full " + `bg-${element.color}-500`}
          style={{
            left: element.position[0],
            top: element.position[1],
            width: elementSize,
            height: elementSize,
          }}
        />
      ))}
    </div>
  );
};
