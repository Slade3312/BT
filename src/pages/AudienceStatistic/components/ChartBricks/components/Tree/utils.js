// count number of leaves in tree
// recursive key: 'children'
export const deepCalculateCountOfLeaves = (curData, currentCount = 0) =>
  (Array.isArray(curData)
    ? currentCount + curData.reduce((acc, next) => deepCalculateCountOfLeaves(next.children, acc + 1), 0)
    : currentCount);
