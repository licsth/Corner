import { FunctionComponent, useEffect } from "react";
import { useParkourContext } from "./ParkourContext";

export const GoalArea: FunctionComponent = () => {
  const {
    goalPosition,
    goalRadius,
    setGoalPosition,
    setGoalSelected,
    goalSelected,
    setGoalRadius,
  } = useParkourContext();

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

    return () => {
      window.removeEventListener("resize", updateGoalPosition);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (goalSelected) {
        // expand / shrink goal on plus and minus keys
        if (e.key === "+") {
          setGoalRadius((r) => r + 10);
        }
        if (e.key === "-") {
          setGoalRadius((r) => Math.max(10, r - 10));
        }
        // move goal on arrow keys
        if (e.key === "ArrowUp") {
          setGoalPosition(([x, y]) => [x, y - 10]);
        }
        if (e.key === "ArrowDown") {
          setGoalPosition(([x, y]) => [x, y + 10]);
        }
        if (e.key === "ArrowLeft") {
          setGoalPosition(([x, y]) => [x - 10, y]);
        }
        if (e.key === "ArrowRight") {
          setGoalPosition(([x, y]) => [x + 10, y]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goalSelected]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setGoalSelected((g) => !g);
      }}
      className={
        "absolute rounded-full bg-green-500 " +
        (goalSelected ? "border border-green-700 border-4" : "")
      }
      style={{
        left: goalPosition[0] - goalRadius,
        top: goalPosition[1] - goalRadius,
        width: goalRadius * 2,
        height: goalRadius * 2,
      }}
    />
  );
};
