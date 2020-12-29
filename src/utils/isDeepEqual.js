export const isDeepEqual = (x, y) => {
  const ok = Object.keys; const tx = typeof x; const
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
        ok(x).every(key => isDeepEqual(x[key], y[key]))
  ) : (x === y);
};
