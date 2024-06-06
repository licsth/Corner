import { Obstacle } from '../components/Parkour'
import { elementSize } from '../components/Gameboard'

export const checkCollision = (
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

    const collidesX =
      newX < obsRight &&
      elementRight > obsX &&
      newY < obsBottom &&
      elementBottom > obsY;
    const collidesY =
      newY < obsBottom &&
      elementBottom > obsY &&
      newX < obsRight &&
      elementRight > obsX;
    if (collidesX && collidesY) {
      // check which collides first
      const xDiff = Math.min(
        Math.abs(newX - obsX),
        Math.abs(newX - obsRight)
      );
      const yDiff = Math.min(
        Math.abs(newY - obsY),
        Math.abs(newY - obsBottom)
      );
      if (xDiff < yDiff) {
        return { collidesX, collidesY: false };
      } else {
        return { collidesX: false, collidesY };
      }
    }

    if (collidesX || collidesY) {
      return { collidesX, collidesY };
    }
  }
  return { collidesX: false, collidesY: false };
};