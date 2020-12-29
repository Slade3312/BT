export const scrollSmoothTo = (topPosition) => {
  window.scrollTo({
    top: topPosition,
    left: 0,
    behavior: 'smooth',
  });
};

export const scrollSmoothToNodeById = (id, offset = 20) => {
  const node = document.getElementById(id);
  if (node) {
    scrollSmoothTo(node.getBoundingClientRect().top + window.pageYOffset - offset);
  }
};

export const scrollTo = (top) => {
  if (typeof window === 'undefined') { return; }
  window.scrollTo(0, top);
};

export const scrollSmoothToNode = (node, offset = 20) => {
  scrollSmoothTo(node.getBoundingClientRect().top + window.pageYOffset - offset);
};
