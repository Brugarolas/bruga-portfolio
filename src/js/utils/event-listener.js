const addEventListener = (element, eventName, callback) => {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback);
  } else if (element.attachEvent) {
    element.attachEvent(eventName, callback);
  }
};

export default addEventListener;
