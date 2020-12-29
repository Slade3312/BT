import { convertListToObjectBy, getFileExtension, getMaxObjBy, map, passAsIs, sumBy } from 'utils/fn';
import { focusFileSizeBytes, focusFileSizeMegabytes } from 'pages/AudienceStatistic/constants';
import { REPORT_CORE_ITEMS_MAP, REPORT_CORE_ITEMS_TITLE } from 'store/AudienceStatistic/reportData/constants';
import { TAXON_TYPE_SUBGROUP } from 'store/NewCampaign/taxonomy/constants';

import {
  CHART_DOUBLE_BAR,
  CHART_PICTORIAL_BAR,
  CHART_PIE,
  CHART_SIMPLE_BAR,
  CHART_TREE_MAP,
  CHART_TRIPLE_PIE_BARS,
} from '../constants';

const allowedFileExtensions = ['csv', 'txt', 'xlsx'];

export const validateFile = (fileBlob) => {
  const isErrorSize = fileBlob.size > focusFileSizeBytes;
  const fileExt = getFileExtension(fileBlob.name);
  const isErrorFormat = !allowedFileExtensions.includes(fileExt);
  if (isErrorSize) {
    return {
      title: 'Неверный размер файла',
      description: `Размер не должен превышать ${focusFileSizeMegabytes} МБ.`,
    };
  }
  if (isErrorFormat) {
    return {
      title: 'Неверный формат файла',
      description:
      // eslint-disable-next-line max-len
          'Для корректной загрузки и распознавания ваших контактов используйте списки в форматах .csv, .txt или .xlsx',
    };
  }
  return undefined;
};

const omitByName = (data, excludeName) => data.filter(item => item.name !== excludeName);

export const groupAndPrepareCharts = (dataArr) => {
  const result = {};
  dataArr.forEach((elem, index) => {
    if (elem.data) {
      const combineChartsKey = elem.group_id ? `group_${elem.group_id}` : `id_${elem.report_setting_id}`;
      const description = elem.group_id && elem.group_name ? elem.group_name : elem.description;
      const dtoToViewType = chartDtoToViewTypesMapper[elem.type];
      elem.data = prepareTreeValueKeyToNumber(elem.data);
      if (!result[combineChartsKey]) {
        result[combineChartsKey] = {
          type: dtoToViewType,
          title: description,
          total: elem.total || 0,
          notFound: elem.not_found,
          notFoundName: elem.not_found_name,
          notFoundIsActive: elem.not_found_is_active,
          data: [],
          color: elem.colors,
          id: index + 1,
        };
      }
      if (elem.data.length > 1) {
        // автомобилисты, возраст и пол (have only one group)
        result[combineChartsKey].hasOnlySingleGroup = true;
        result[combineChartsKey].data = elem.data.map(item => ({
          ...item,
          total: elem.total || 0,
          notFound: elem.not_found,
          notFoundName: elem.not_found_name,
          notFoundIsActive: elem.not_found_is_active,
        }));
      } else if (elem.data.length === 1) {
        // интересы (have many groups, we must collect all group to one structure)
        const curData = elem.data[0];
        curData.total = elem.total || 0;
        curData.notFound = elem.not_found;
        curData.notFoundName = elem.not_found_name;
        curData.notFoundIsActive = elem.not_found_is_active;
        result[combineChartsKey].data.push(curData);
      }
    }
  });

  map(result, (elem) => {
    const selectorData = chartDataSelectors[elem.type];
    elem.data = selectorData(elem);
  });
  return Object.values(result);
};

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

const chartDtoToViewTypesMapper = {
  tree: CHART_TREE_MAP,
  pie: CHART_PIE,
  simpleBar: CHART_SIMPLE_BAR,
  doubleBar: CHART_DOUBLE_BAR,
  pictorialBar: CHART_PICTORIAL_BAR,
  triplePieBars: CHART_TRIPLE_PIE_BARS,
};

const chartDataSelectors = {
  [CHART_PIE]: ({ data, notFound, notFoundName, notFoundIsActive }) => {
    const pickedData = data[0].data;
    return notFound && notFoundIsActive ? [...pickedData, { value: notFound, name: notFoundName }] : pickedData;
  },
  [CHART_SIMPLE_BAR]: ({ data, notFound, notFoundName, notFoundIsActive }) => {
    const pickedData = data[0].data;
    return notFound && notFoundIsActive ? [{ value: notFound, name: notFoundName }, ...pickedData] : pickedData;
  },
  [CHART_DOUBLE_BAR]: ({ data }) => {
    return data;
  },
  [CHART_PICTORIAL_BAR]: ({ data, notFound, notFoundName, notFoundIsActive, title }) => {
    const pickedData = data[0].data;
    // strange business requirements
    if (title === 'География') {
      const preparedData =
        pickedData[0]?.name === 'Другие города' ? [...pickedData.slice(1), pickedData[0]] : pickedData;
      return notFound && notFoundIsActive ? [...preparedData, { value: notFound, name: notFoundName }] : preparedData;
    }
    return notFound && notFoundIsActive ? [...pickedData, { value: notFound, name: notFoundName }] : pickedData;
  },
  [CHART_TREE_MAP]: ({ data, hasOnlySingleGroup, notFoundIsActive, notFoundName, notFound, total }) => {
    const curData = [...data];

    if (hasOnlySingleGroup && notFoundIsActive && notFound) {
      curData.push({ value: notFound, name: notFoundName, total });
    }

    const dataWithNotFoundItems = curData.map((firstLevelData) => {
      if (firstLevelData.notFound && firstLevelData.notFoundIsActive) {
        return {
          ...firstLevelData,
          children: [
            ...(firstLevelData.children || {}),
            { value: firstLevelData.notFound, name: firstLevelData.notFoundName },
          ],
        };
      }
      return firstLevelData;
    });
    return Object.values(dataWithNotFoundItems).map(item => deepPrepareOneLevelData(item, item, item.total));
  },
  [CHART_TRIPLE_PIE_BARS]: ({ data }) => data,
};

export const useReportCoreItems = (chartsList) => {
  const reportsMapByTitle = convertListToObjectBy('title')(chartsList);

  const socialNetworks = reportsMapByTitle[REPORT_CORE_ITEMS_MAP.SOCIAL_NETWORKS];
  const income = reportsMapByTitle[REPORT_CORE_ITEMS_MAP.INCOME];
  const genderAndAge = reportsMapByTitle[REPORT_CORE_ITEMS_MAP.GENDER_AND_AGE];
  const geo = reportsMapByTitle[REPORT_CORE_ITEMS_MAP.GEO];

  // don't forget we must exclude notFound name item from the samples (socialNetworks, income and geo)
  const definedSocialNetworksData = socialNetworks && omitByName(socialNetworks.data, socialNetworks.notFoundName);
  const definedIncomeData = income && omitByName(income.data, income.notFoundName);
  const definedGeoData = geo && omitByName(geo.data, geo.notFoundName);

  return {
    [REPORT_CORE_ITEMS_TITLE.INCOME]: !!income && {
      title: REPORT_CORE_ITEMS_TITLE.INCOME,
      descriptions: [`${getMaxObjBy(definedIncomeData, elem => elem.value)?.name.replace('к', '')} тыс. руб.`],
    },
    [REPORT_CORE_ITEMS_TITLE.SOCIAL_NETWORKS]: !!socialNetworks && {
      title: REPORT_CORE_ITEMS_TITLE.SOCIAL_NETWORKS,
      descriptions: [getMaxObjBy(definedSocialNetworksData, elem => elem.value)?.name],
    },
    [REPORT_CORE_ITEMS_TITLE.GENDER_AND_AGE]: !!genderAndAge && {
      title: REPORT_CORE_ITEMS_TITLE.GENDER_AND_AGE,
      descriptions: calcGenderAndAge(genderAndAge),
    },
    [REPORT_CORE_ITEMS_TITLE.GEO]: !!geo && {
      title: REPORT_CORE_ITEMS_TITLE.GEO,
      descriptions: [getMaxObjBy(definedGeoData?.filter(item => item.name !== 'Другие города'), elem => elem.value)?.name],
    },
  };
};

export const useReportCoreItemsList = (chartsList) => {
  const data = useReportCoreItems(chartsList);
  return [
    data[REPORT_CORE_ITEMS_TITLE.INCOME],
    data[REPORT_CORE_ITEMS_TITLE.SOCIAL_NETWORKS],
    data[REPORT_CORE_ITEMS_TITLE.GENDER_AND_AGE],
    data[REPORT_CORE_ITEMS_TITLE.GEO],
  ].filter(passAsIs);
};

function calcGenderAndAge(data) {
  const firstTotalSum = sumBy(data.data[0].data, elem => elem.value);
  const secondTotalSum = sumBy(data.data[1].data, elem => elem.value);
  const firstMax = getMaxObjBy(data.data[0].data, elem => elem.value);
  const secondMax = getMaxObjBy(data.data[1].data, elem => elem.value);
  const firstDescription = `${data.data[0].name} ${firstMax.name} лет`;
  const secondDescription = `${data.data[1].name} ${secondMax.name} лет`;

  if (firstTotalSum > secondTotalSum) {
    return [firstDescription];
  }
  if (firstTotalSum < secondTotalSum) {
    return [secondDescription];
  }
  return [firstDescription, secondDescription];
}

export const normalizeError = (error, maxCount) => {
  let web = '';
  let phones = '';
  if (error === `Убедитесь, что количество элементов меньше или равно чем ${maxCount}`) {
    web = `Превышено максимально допустимое количество сайтов - ${maxCount}. Загрузите новый файл.`;
    phones = `Превышено максимально допустимое количество номеров телефонов - ${maxCount}. Загрузите новый файл.`;
  } else {
    web = error;
    phones = error;
  }
  return {
    phones,
    web,
  };
};

export const allTaxonsBySubgroupsMapIds = (taxons) => {
  const result = {};
  const taxonsList = Object.values(taxons);

  taxonsList.forEach((group) => {
    group.forEach((item) => {
      if (item.type === TAXON_TYPE_SUBGROUP) {
        item.items.forEach((subItem) => {
          result[subItem.key] = item.subgroup;
        });
      }
    });
  });
  return result;
};
