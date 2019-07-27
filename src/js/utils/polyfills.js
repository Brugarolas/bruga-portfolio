(function (prototype) {
  Object.defineProperties(prototype, {
    'scrollIsOnTop': {
      get: function scrollIsOnTop() {
        return Math.round(this.scrollTop) <= 0;
      }
    },
    'scrollIsOnBottom': {
      get: function scrollIsOnBottom() {
        return Math.round(this.scrollTop) >= this.scrollTopMax;
      }
    },
    'scrollToTop': {
      value: function scrollToTop() {
        if (this.scrollTo) {
          this.scrollTo(0, 0);
        } else {
          this.scrollTop = 0;
        }
      }
    }
  });

  if (!('scrollTopMax' in prototype)) {
    Object.defineProperties(prototype, {
      'scrollTopMax': {
        get: function scrollTopMax() {
          return this.scrollHeight - window.innerHeight;
        }
      },
      'scrollLeftMax': {
        get: function scrollLeftMax() {
          return this.scrollWidth - window.innerHeight;
        }
      }
    });
  }
}
)(Element.prototype);
