import { getLabelTemplate, getTooltipTemplate } from './templates';

const getFormattedPercentValue = (value, totalValue) => {
  const percent = (100 / totalValue) * value;
  if (percent % 1 === 0) return Math.round(percent);
  return percent.toFixed(1);
};

export const tooltipFormatter = (name, value, totalValue) =>
  (totalValue === 0
    ? getTooltipTemplate(name, 0, 0)
    : getTooltipTemplate(name, getFormattedPercentValue(value, totalValue), value));

export const labelFullInfoFormatter = (name, value, totalValue) =>
  (totalValue === 0
    ? getLabelTemplate(name, 0, 0)
    : getLabelTemplate(name, getFormattedPercentValue(value, totalValue), value));

export const labelPercentFormatter = (value, totalValue) =>
  (totalValue === 0 ? `(${0}%)` : `${getFormattedPercentValue(value, totalValue)}%`);

export const axisLabelFormatter = maxLength => label =>
  (label.length > maxLength ? `${label.slice(0, maxLength)}...` : label);
