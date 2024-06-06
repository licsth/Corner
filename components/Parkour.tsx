import {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

interface Obstacle {
  position: [number, number];
  size: [number, number];
}

export const Parkour: FunctionComponent = () => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [selectedObstacleIndex, setSelectedObstacleIndex] = useState<
    number | null
  >(null);

  const addObstacle: MouseEventHandler = (e) => {
    const newObstacle: Obstacle = {
      position: [e.clientX, e.clientY],
      size: [100, 10],
    };
    setObstacles([...obstacles, newObstacle]);
    setSelectedObstacleIndex(obstacles.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // remove selected obstacle on delete key press
      if (e.key === "Backspace" && selectedObstacleIndex !== null) {
        setObstacles((obstacles) => [
          ...obstacles.slice(0, selectedObstacleIndex),
          ...obstacles.slice(selectedObstacleIndex + 1),
        ]);
        setSelectedObstacleIndex(null);
        return;
      }
      // rotate selected obstacle on tab key press
      if (e.key === "Tab" && selectedObstacleIndex !== null) {
        e.preventDefault();
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
          return [
            ...obstacles.slice(0, selectedObstacleIndex),
            {
              ...obstacle,
              size: [obstacle.size[1], obstacle.size[0]],
            },
            ...obstacles.slice(selectedObstacleIndex + 1),
          ];
        });
        return;
      }
      // make selected obstacles wider on right arrow key press
      if (e.key === "ArrowRight" && selectedObstacleIndex !== null) {
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
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
      if (e.key === "ArrowLeft" && selectedObstacleIndex !== null) {
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
      if (e.key === "ArrowDown" && selectedObstacleIndex !== null) {
        setObstacles((obstacles) => {
          const obstacle = obstacles[selectedObstacleIndex];
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
      if (e.key === "ArrowUp" && selectedObstacleIndex !== null) {
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
    <div className="w-screen h-screen bg-slate-800" onClick={addObstacle}>
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className={`absolute ${selectedObstacleIndex === index ? "bg-red-500" : "bg-blue-500"}`}
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
    </div>
  );
};
