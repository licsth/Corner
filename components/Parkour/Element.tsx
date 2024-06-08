import { FunctionComponent, useEffect } from "react";
import { colors, elementDiameter } from "../Gameboard";
import { checkCollision } from "../../utilities/checkCollision";
import { useParkourContext } from "./ParkourContext";

export const ElementComponent: FunctionComponent = () => {
  const {
    element,
    obstacles,
    setElement,
    elementMoving,
    goalPosition,
    goalRadius,
    setElementMoving,
    setElementSelected,
    elementSelected,
  } = useParkourContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setElement((element) => {
        if (!elementMoving) return element;
        const [x, y] = element.position;
        const [dx, dy] = element.direction;
        let newX = Math.max(
          0,
          Math.min(x + dx, window.innerWidth - elementDiameter)
        );
        let newY = Math.max(
          0,
          Math.min(y + dy, window.innerHeight - elementDiameter)
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

        // Check for goal collisions
        const [goalX, goalY] = goalPosition;
        const distance = Math.sqrt(
          (goalX - newX - elementDiameter / 2) ** 2 +
            (goalY - newY - elementDiameter / 2) ** 2
        );
        if (distance < goalRadius) {
          setElementMoving(false);
        }

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
  }, [elementMoving, obstacles, goalPosition, goalRadius]);

  // pause element on space bar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        setElementMoving((e) => !e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setElementSelected((e) => !e);
      }}
      className={
        "absolute rounded-full " +
        `bg-${element.color}-500 ` +
        (elementSelected ? `border-2 border-${element.color}-700` : "")
      }
      style={{
        left: element.position[0],
        top: element.position[1],
        width: elementDiameter,
        height: elementDiameter,
        zIndex: 100,
      }}
    />
  );
};
