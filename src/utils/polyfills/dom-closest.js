(function domClosestModule() {
  if (!Element.prototype.closest) {
    Element.prototype.closest = function closest(css) {
      let node = this;

      while (node) {
        if (node.matches(css)) return node;
        node = node.parentElement;
      }
      return null;
    };
  }
}());
