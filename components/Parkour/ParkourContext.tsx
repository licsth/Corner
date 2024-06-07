import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Obstacle } from "./Parkour";
import { Element } from "../Gameboard";

export const ParkourContext = createContext<{
  obstacles: Obstacle[];
  setObstacles: Dispatch<SetStateAction<Obstacle[]>>;
  selectedObstacleIndex: number | null;
  setSelectedObstacleIndex: Dispatch<SetStateAction<number | null>>;
  element: Element;
  setElement: Dispatch<SetStateAction<Element>>;
  elementMoving: boolean;
  setElementMoving: Dispatch<SetStateAction<boolean>>;
  goalRadius: number;
  setGoalRadius: Dispatch<SetStateAction<number>>;
  goalPosition: [number, number];
  setGoalPosition: Dispatch<SetStateAction<[number, number]>>;
}>({
  obstacles: [],
  setObstacles: () => {},
  selectedObstacleIndex: null,
  setSelectedObstacleIndex: () => {},
  element: {
    color: "yellow",
    direction: [3, 1],
    position: [0, 0],
  },
  setElement: () => {},
  elementMoving: false,
  setElementMoving: () => {},
  goalRadius: 100,
  setGoalRadius: () => {},
  goalPosition: [0, 0],
  setGoalPosition: () => {},
});

export const ParkourContextWrapper: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [selectedObstacleIndex, setSelectedObstacleIndex] = useState<
    number | null
  >(null);

  const [element, setElement] = useState<Element>({
    color: "yellow",
    direction: [3, 0.95],
    position: [0, 0],
  });
  const [elementMoving, setElementMoving] = useState(true);
  const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);
  const [goalRadius, setGoalRadius] = useState(100);

  return (
    <ParkourContext.Provider
      value={{
        obstacles,
        setObstacles,
        selectedObstacleIndex,
        setSelectedObstacleIndex,
        element,
        setElement,
        elementMoving,
        setElementMoving,
        goalRadius,
        setGoalRadius,
        goalPosition,
        setGoalPosition,
      }}
    >
      {children}
    </ParkourContext.Provider>
  );
};

export const useParkourContext = () => useContext(ParkourContext);
