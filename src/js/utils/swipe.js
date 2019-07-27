import addEventListener from '../utils/event-listener.js';
import { Subscription } from './subscription.js';

export const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

const swipeDetect = (element, params = {}) => {
  if (!element) {
    return;
  }

  const touchSurface = element;
  const emitter = params.emitter || new Subscription();
  const threshold = params.threshold || 150; // Required min distance traveled to be considered swipe
  const restraint = params.restraint || 100; // Maximum distance allowed at the same time in perpendicular direction
  const allowedTime = params.allowedTime || 300; // Maximum time allowed to travel that distance

  const calcSwipeDirection = (elapsedTime, distX, distY) => {
    if (elapsedTime <= allowedTime) { // First condition for awipe met
        const absoluteX = Math.abs(distX);
        const absoluteY = Math.abs(distY);

        if (absoluteX >= threshold && absoluteY <= restraint) { // 2nd condition for horizontal swipe met
            return (distX < 0) ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT; // If dist traveled is negative, it indicates left swipe
        }
        if (absoluteY >= threshold && absoluteX <= restraint) { // 2nd condition for vertical swipe met
            return (distY < 0) ? DIRECTIONS.UP : DIRECTIONS.DOWN; // If dist traveled is negative, it indicates up swipe
        }
    }
  }

  let startX, startY, startTime;

  addEventListener(touchSurface, 'touchstart', (event) => {
    const touchObject = event.changedTouches[0];

    startX = touchObject.pageX;
    startY = touchObject.pageY;
    startTime = Date.now();
  });

  addEventListener(touchSurface, 'touchend', (event) => {
    const touchObject = event.changedTouches[0];

    const elapsedTime = Date.now() - startTime;
    const distX = touchObject.pageX - startX; // Get horizontal dist traveled by finger while in contact with surface
    const distY = touchObject.pageY - startY; // Get vertical dist traveled by finger while in contact with surface
    const swipeDirection = calcSwipeDirection(elapsedTime, distX, distY);

    if (swipeDirection) {
      const emitEvent = {
        direction: swipeDirection,
        offsetX: distX,
        offsetY: distY,
        time: elapsedTime
      };

      emitter.emit('swipe', emitEvent);
      emitter.emit(swipeDirection, emitEvent);
    }
  });

  return emitter;
}

export default swipeDetect;
