import {
  createContext,
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
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
  goalSelected: boolean;
  setGoalSelected: Dispatch<SetStateAction<boolean>>;
  elementSelected: boolean;
  setElementSelected: Dispatch<SetStateAction<boolean>>;
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
  goalSelected: false,
  setGoalSelected: () => {},
  elementSelected: false,
  setElementSelected: () => {},
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
  const [elementMoving, setElementMoving] = useState(false);
  const [goalPosition, setGoalPosition] = useState<[number, number]>([0, 0]);
  const [goalRadius, setGoalRadius] = useState(100);
  const [goalSelected, setGoalSelected] = useState(false);
  const [elementSelected, setElementSelected] = useState(false);

  useEffect(() => {
    if (goalSelected) {
      setSelectedObstacleIndex(null);
      setElementSelected(false);
    }
  }, [goalSelected]);

  useEffect(() => {
    if (selectedObstacleIndex != null) {
      setGoalSelected(false);
      setElementSelected(false);
    }
  }, [selectedObstacleIndex]);

  useEffect(() => {
    if (elementSelected) {
      setSelectedObstacleIndex(null);
      setGoalSelected(false);
    }
  }, [elementSelected]);

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
        goalSelected,
        setGoalSelected,
        elementSelected,
        setElementSelected,
      }}
    >
      {children}
    </ParkourContext.Provider>
  );
};

export const useParkourContext = () => useContext(ParkourContext);
