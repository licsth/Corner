import {
  Dispatch,
  FunctionComponent,
  MouseEventHandler,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { Element, colors, elementSize } from "./Gameboard";
import { checkCollision } from "../utilities/checkCollision";
import { Obstacles } from "./Obstacles";

export interface Obstacle {
  position: [number, number];
  size: [number, number];
}

export const ParkourContext = createContext<{
  obstacles: Obstacle[];
  setObstacles: Dispatch<SetStateAction<Obstacle[]>>;
  selectedObstacleIndex: number | null;
  setSelectedObstacleIndex: Dispatch<SetStateAction<number | null>>;
}>({
  obstacles: [],
  setObstacles: () => {},
  selectedObstacleIndex: null,
  setSelectedObstacleIndex: () => {},
});

const goalRadius = 100;

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
  const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    // Function to update the goal position
    const updateGoalPosition = () => {
      if (typeof window !== "undefined") {
        setGoalPosition([
          window.innerWidth - goalRadius,
          window.innerHeight / 2,
        ]);
      }
    };

    // Update goal position on mount
    updateGoalPosition();

    // Add event listener for window resize
    window.addEventListener("resize", updateGoalPosition);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateGoalPosition);
    };
  }, []);

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
    <ParkourContext.Provider
      value={{
        obstacles,
        setObstacles,
        selectedObstacleIndex,
        setSelectedObstacleIndex,
      }}
    >
      <div className="w-screen h-screen bg-slate-800" onClick={addObstacle}>
        <div
          className="absolute rounded-full bg-green-500"
          style={{
            left: goalPosition[0],
            top: goalPosition[1],
            width: goalRadius,
            height: goalRadius,
          }}
        />
        <Obstacles />
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
    </ParkourContext.Provider>
  );
};
