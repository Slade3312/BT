import { useMemo } from 'react';
import Templates from 'store/mobx/Templates';

export const useNormalizedInternetFields = () => {
  const formData = Templates.getNewCampaignTemplate('BriefOrderInternet').form_order || {};
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
