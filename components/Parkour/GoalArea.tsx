import { FunctionComponent, useEffect } from "react";
import { useParkourContext } from "./ParkourContext";

export const GoalArea: FunctionComponent = () => {
  const { goalPosition, goalRadius, setGoalPosition } = useParkourContext();

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

  return (
    <div
      className="absolute rounded-full bg-green-500"
      style={{
        left: goalPosition[0],
        top: goalPosition[1],
        width: goalRadius,
        height: goalRadius,
      }}
    />
  );
};
