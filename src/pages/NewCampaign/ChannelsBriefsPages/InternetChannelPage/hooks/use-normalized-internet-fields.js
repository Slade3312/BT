import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getInternetBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';

export const useNormalizedInternetFields = () => {
  const formData = useSelector(getInternetBriefFormOrder) || {};
  const { mobileVersionYes, mobileVersionNo, mobileVersion: mobileVersionField, ...otherFields } = formData;

  return useMemo(
    () => ({
      ...otherFields,
      mobileVersion: {
        ...mobileVersionField,
        options: [{ ...mobileVersionYes, value: true }, { ...mobileVersionNo, value: false }],
      },
    }),
    [formData],
  );
};
