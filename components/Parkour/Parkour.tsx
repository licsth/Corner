import { FunctionComponent, MouseEventHandler, useEffect } from "react";
import { Obstacles } from "./Obstacles";
import { ElementComponent } from "./Element";
import { useParkourContext } from "./ParkourContext";
import { GoalArea } from "./GoalArea";

export interface Obstacle {
  position: [number, number];
  size: [number, number];
}

export const Parkour: FunctionComponent = () => {
  const { obstacles, setObstacles, setSelectedObstacleIndex } =
    useParkourContext();

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

  return (
    <div className="w-screen h-screen bg-slate-800" onClick={addObstacle}>
      <GoalArea />
      <Obstacles />
      <ElementComponent />
    </div>
  );
};
