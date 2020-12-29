export const getOptionsWithToolboxByFlags = ({ hasLineView, hasBarView, hasRestore, hasSaveAsImage }) => ({
  ...{
    toolbox: {
      right: '0',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: [0, 0, 0, 8],
      padding: [5, 10, 20, 25],
      feature: {
        magicType: {
          show: true,
          type: [hasLineView && 'line', hasBarView && 'bar'],
          title: {
            line: 'Линейная',
            bar: 'Столбчатая',
          },
        },
        ...(hasRestore ? { restore: { show: true, title: 'Обновить' } } : {}),
        ...(hasSaveAsImage
          ? {
            saveAsImage: {
              show: true,
              // added special invisible symbols to make right padding
              title: 'Сохранить',
              type: 'png',
              name: 'GenderImg',
            },
          }
          : {}),
      },
    },
  },
});
