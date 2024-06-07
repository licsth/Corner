import { FunctionComponent, useContext } from "react";
import { ParkourContext } from "./Parkour";
import { elementSize } from "../Gameboard";

export const ElementComponent: FunctionComponent = () => {
  const { element } = useContext(ParkourContext);

  return (
    <div
      className={"absolute rounded-full " + `bg-${element.color}-500`}
      style={{
        left: element.position[0],
        top: element.position[1],
        width: elementSize,
        height: elementSize,
      }}
    />
  );
};
