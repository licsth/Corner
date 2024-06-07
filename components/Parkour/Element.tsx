import { FunctionComponent, useContext, useEffect } from "react";
import { ParkourContext } from "./Parkour";
import { colors, elementSize } from "../Gameboard";
import { checkCollision } from "../../utilities/checkCollision";

export const ElementComponent: FunctionComponent = () => {
  const { element, obstacles, setElement, elementMoving, setElementMoving } =
    useContext(ParkourContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setElement((element) => {
        if (!elementMoving) return element;
        const [x, y] = element.position;
        const [dx, dy] = element.direction;
        let newX = Math.max(
          0,
          Math.min(x + dx, window.innerWidth - elementSize)
        );
        let newY = Math.max(
          0,
          Math.min(y + dy, window.innerHeight - elementSize)
        );
        let bouncedX = x === newX && dx !== 0;
        let bouncedY = y === newY && dy !== 0;

        // Check for obstacle collisions
        const { collidesX, collidesY } = checkCollision(
          x,
          y,
          newX,
          newY,
          obstacles
        );

        if (collidesX) newX = x;
        if (collidesY) newY = y;
        bouncedX = bouncedX || collidesX;
        bouncedY = bouncedY || collidesY;
        let newDx = bouncedX ? -dx : dx;
        let newDy = bouncedY ? -dy : dy;

        return {
          ...element,
          color:
            bouncedX || bouncedY || collidesX || collidesY
              ? colors[(colors.indexOf(element.color) + 1) % colors.length]
              : element.color,
          position: [newX, newY],
          direction: [newDx, newDy],
        };
      });
    }, 20);
    return () => clearInterval(interval);
  }, [elementMoving, obstacles]);

  return (
    <div
      className={"absolute rounded-full " + `bg-${element.color}-500`}
      style={{
        left: element.position[0],
        top: element.position[1],
        width: elementSize,
        height: elementSize,
      }}
    />
  );
};