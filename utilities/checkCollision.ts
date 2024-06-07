import { Obstacle } from '../components/Parkour'
import { elementSize } from '../components/Gameboard'

export const checkCollision = (
  prevX: number,
  prevY: number,
  newX: number,
  newY: number,
  obstacles: Obstacle[]
) => {
  const elementRight = newX + elementSize;
  const elementBottom = newY + elementSize;

  for (let obstacle of obstacles) {
    const [obsX, obsY] = obstacle.position;
    const [obsWidth, obsHeight] = obstacle.size;
    const obsRight = obsX + obsWidth;
    const obsBottom = obsY + obsHeight;

    const collides =
      newX < obsRight &&
      elementRight > obsX &&
      newY < obsBottom &&
      elementBottom > obsY;
    if (!collides) continue;
    const collidesXBefore = prevX < obsRight && prevX + elementSize > obsX;
    return { collidesX: !collidesXBefore, collidesY: collidesXBefore };
  }
  return { collidesX: false, collidesY: false };
};