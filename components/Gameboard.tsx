import { max, min, range, set } from "lodash";
import React, {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";

const colors = ["blue", "green", "yellow", "orange", "red", "pink", "violet"];

interface Element {
  direction: [number, number];
  position: [number, number];
  color: string;
}

const elementSize = 18;

export const Gameboard: FunctionComponent = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);

  const addElement: MouseEventHandler = (e) => {
    const newElement: Element = {
      direction: [Math.random() * 2 - 1, Math.random() * 2 - 1],
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
          const newX = Math.max(
            0,
            Math.min(x + dx, window.innerWidth - elementSize)
          );
          const newY = Math.max(
            0,
            Math.min(y + dy, window.innerHeight - elementSize)
          );
          return { ...element, position: [newX, newY] };
        })
      );
    }, 10);
    return () => clearInterval(interval);
  }, [elements, window.innerHeight, window.innerWidth]);

  return (
    <div className="fixed h-screen bg-slate-800 w-screen" onClick={addElement}>
      {elements.map((element, index) => (
        <div
          key={index}
          className={
            "absolute w-4 h-4 rounded-full " + `bg-${element.color}-500`
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
