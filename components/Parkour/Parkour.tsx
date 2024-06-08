import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Obstacles } from "./Obstacles";
import { ElementComponent } from "./Element";
import { useParkourContext } from "./ParkourContext";
import { GoalArea } from "./GoalArea";
import { elementDiameter } from "../Gameboard";

export interface Obstacle {
  position: [number, number];
  size: [number, number];
}

export const Parkour: FunctionComponent = () => {
  const {
    obstacles,
    setObstacles,
    setSelectedObstacleIndex,
    elementSelected,
    setElement,
    setElementMoving,
    setElementSelected,
    element,
  } = useParkourContext();

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [mousePosition]);

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

    setObstacles((obstacles) => [...obstacles, newObstacle]);
    setSelectedObstacleIndex(obstacles.length);
  };

  const onScreenClicked: MouseEventHandler = (e) => {
    if (elementSelected) {
      // calculate direction as difference of mouse position and element position
      setElement((element) => {
        return {
          ...element,
          direction: [
            (e.clientX - element.position[0]) / 100,
            (e.clientY - element.position[1]) / 100,
          ],
        };
      });
      setElementMoving(true);
      setElementSelected(false);
      return;
    }
    addObstacle(e);
  };

  const elementToMouseDiff = useMemo(
    () => ({
      x: mousePosition.x - element.position[0] - elementDiameter / 2,
      y: mousePosition.y - element.position[1] - elementDiameter / 2,
    }),
    [mousePosition, element]
  );
  const elementToMouseAngle = useMemo(
    () =>
      Math.atan(elementToMouseDiff.y / elementToMouseDiff.x) * (180 / Math.PI) +
      (elementToMouseDiff.x < 0 ? 180 : 0),
    [elementToMouseDiff]
  );

  return (
    <div
      className="w-screen h-screen bg-slate-800 overflow-hidden relative"
      onClick={onScreenClicked}
    >
      <GoalArea />
      <Obstacles />
      <ElementComponent />
      {elementSelected && (
        // dashed line from mousePosition to element position
        <div
          className="absolute"
          style={{
            border: "1px dashed white",
            left: element.position[0] + elementDiameter / 2,
            top: element.position[1] + elementDiameter / 2,
            width: 0,
            height: Math.sqrt(
              Math.pow(elementToMouseDiff.x, 2) +
                Math.pow(elementToMouseDiff.y, 2)
            ),
            transform: `rotate(${elementToMouseAngle - 90}deg)`,
            transformOrigin: "top",
            pointerEvents: "none",
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
};
