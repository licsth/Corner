import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Obstacle } from "./Parkour";

interface Props {
  obstacles: Obstacle[];
  setObstacles: Dispatch<SetStateAction<Obstacle[]>>;
  selectedObstacleIndex: number | null;
  setSelectedObstacleIndex: Dispatch<SetStateAction<number | null>>;
}

export const Obstacles: FunctionComponent<Props> = ({
  obstacles,
  setObstacles,
  selectedObstacleIndex,
  setSelectedObstacleIndex,
}) => {
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

  return (
    <>
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
    </>
  );
};
