import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import { Element, colors, elementSize } from "./Gameboard";
import { checkCollision } from "../utilities/checkCollision";

export interface Obstacle {
  position: [number, number];
  size: [number, number];
}

export const Parkour: FunctionComponent = () => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [selectedObstacleIndex, setSelectedObstacleIndex] = useState<
    number | null
  >(null);
  const [element, setElement] = useState<Element>({
    color: "yellow",
    direction: [3, 1],
    position: [0, 0],
  });
  const [elementMoving, setElementMoving] = useState(true);

  const addObstacle: MouseEventHandler = (e) => {
    // don't allow when margin bottom is less than 10
    if (e.clientY > window.innerHeight - 10) return;
    const newObstacle: Obstacle = {
      position: [e.clientX, e.clientY],
      size: [100, 10],
    };
    // restrict obstacles width to be within the window
    newObstacle.size[0] = Math.min(
      newObstacle.size[0],
      window.innerWidth - newObstacle.position[0]
    );

    setObstacles([...obstacles, newObstacle]);
    setSelectedObstacleIndex(obstacles.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedObstacleIndex === null) return;
      // remove selected obstacle on delete key press
      if (e.key === "Backspace") {
        setObstacles((obstacles) => [
          ...obstacles.slice(0, selectedObstacleIndex),
          ...obstacles.slice(selectedObstacleIndex + 1),
        ]);
        setSelectedObstacleIndex(null);
        return;
      }
      // rotate selected obstacle on tab key press
      if (e.key === "Tab") {
        e.preventDefault();
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          let newHeight = obstacle.size[0];
          let newWidth = obstacle.size[1];
          // cut off the obstacle if it goes out of the window
          if (obstacle.position[0] + newWidth > window.innerWidth)
            newWidth = window.innerWidth - obstacle.position[0];
          if (obstacle.position[1] + newHeight > window.innerHeight)
            newHeight = window.innerHeight - obstacle.position[1];
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [newWidth, newHeight],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
      // make selected obstacles wider on right arrow key press
      if (e.key === "ArrowRight") {
        // pass if selected obstacle is already at the right edge
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          if (obstacle.position[0] + obstacle.size[0] + 10 > window.innerWidth)
            return obstacles;
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [obstacle.size[0] + 10, obstacle.size[1]],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
      // make selected obstacles narrower on left arrow key press
      if (e.key === "ArrowLeft") {
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [Math.max(10, obstacle.size[0] - 10), obstacle.size[1]],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
      // make selected obstacles taller on down arrow key press
      if (e.key === "ArrowDown") {
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          // pass if selected obstacle is already at the bottom edge
          if (obstacle.position[1] + obstacle.size[1] + 10 > window.innerHeight)
            return obstacles;
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [obstacle.size[0], obstacle.size[1] + 10],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
      // make selected obstacles shorter on up arrow key press
      if (e.key === "ArrowUp") {
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [obstacle.size[0], Math.max(10, obstacle.size[1] - 10)],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObstacleIndex]);

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
    <div className="w-screen h-screen bg-slate-800" onClick={addObstacle}>
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className={`absolute ${selectedObstacleIndex === index ? "bg-red-500" : "bg-slate-500"}`}
          style={{
            left: obstacle.position[0],
            top: obstacle.position[1],
            width: obstacle.size[0],
            height: obstacle.size[1],
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedObstacleIndex(index);
          }}
        />
      ))}
      <div
        className={"absolute rounded-full " + `bg-${element.color}-500`}
        style={{
          left: element.position[0],
          top: element.position[1],
          width: elementSize,
          height: elementSize,
        }}
      />
    </div>
  );
};
