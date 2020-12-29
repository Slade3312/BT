export const deepPrepareOneLevelData = (curData, parentData, allLevelsTotal) => {
  if (Array.isArray(curData)) {
    return curData.map(item => deepPrepareOneLevelData(item, parentData, allLevelsTotal));
  }
  if (curData && typeof curData === 'object') {
    return {
      ...curData,
      calculatedTotal: allLevelsTotal,
      children: deepPrepareOneLevelData(curData.children, curData, allLevelsTotal),
    };
  }
  return curData;
};

export const prepareTreeValueKeyToNumber = (data) => {
  if (Array.isArray(data)) {
    return data.map(prepareTreeValueKeyToNumber);
  }
  if (typeof data === 'object') {
    return {
      ...data,
      value: data.value && Number(data.value),
      children: prepareTreeValueKeyToNumber(data.children),
    };
  }
  return data;
};
