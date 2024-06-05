import { max, min, range, set } from "lodash";
import React, {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
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

const elementSize = 23;

export const Gameboard: FunctionComponent = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);

  const addElement: MouseEventHandler = (e) => {
    const newDirection = [Math.random() * 2 - 1, Math.random() * 2 - 1];
    // normalize the direction vector
    const magnitude =
      Math.sqrt(newDirection[0] ** 2 + newDirection[1] ** 2) / 2;
    newDirection[0] /= magnitude;
    newDirection[1] /= magnitude;
    const newElement: Element = {
      direction: newDirection as [number, number],
      position: [e.clientX, e.clientY],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setElements([...elements, newElement]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElements(
        elements.map((element) => {
          const [x, y] = element.position;
          const [dx, dy] = element.direction;
          // Bounce off the walls
          const newX = Math.max(
            0,
            Math.min(x + dx, window.innerWidth - elementSize)
          );
          const newY = Math.max(
            0,
            Math.min(y + dy, window.innerHeight - elementSize)
          );
          const tolerance = 4;
          // Bounce off the walls
          const newDx = x === newX ? -dx : dx;
          const newDy = y === newY ? -dy : dy;
          return {
            ...element,
            color:
              x === newX || y === newY
                ? colors[(colors.indexOf(element.color) + 1) % colors.length]
                : element.color,
            position: [newX, newY],
            direction: [newDx, newDy],
          };
        })
      );
    }, 10);
    return () => clearInterval(interval);
  }, [elements]);

  return (
    <div className="fixed h-screen bg-slate-800 w-screen" onClick={addElement}>
      {elements.map((element, index) => (
        <div
          key={index}
          className={
            "absolute w-5 h-5 rounded-full " + `bg-${element.color}-500`
          }
          style={{
            left: element.position[0],
            top: element.position[1],
          }}
        />
      ))}
    </div>
  );
};
