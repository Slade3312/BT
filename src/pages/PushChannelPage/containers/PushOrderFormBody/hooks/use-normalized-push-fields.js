import { useMemo } from 'react';
import Templates from 'store/mobx/Templates';
import { ORDER_TEST_NUMBERS_FIELD } from 'store/NewCampaign/channels/constants';
import { PUSH_TARGET_ACTIONS } from '../../../constants';

export const useNormalizedPushFields = () => {
  const formData = Templates.getNewCampaignTemplate('BriefOrderPush').form_order || {};
  const {
    targetActionDownload,
    targetActionLink,
    targetAction: targetActionField,
    testCtns: testCtnsField,
    timeSending,
    urlAdvertiser,
    total,
    text,
    date,
    additionalInfo,
  } = formData;

  const { targetAction, testCtns } = useMemo(() => ({
    targetAction: {
      ...targetActionField,
      options: [
        {
          ...targetActionLink,
          value: PUSH_TARGET_ACTIONS.FOLLOW_LINK,
        },
        {
          ...targetActionDownload,
          value: PUSH_TARGET_ACTIONS.APP_DOWNLOAD,
        },
      ],
    },
    testCtns: {
      ...testCtnsField,
      id: ORDER_TEST_NUMBERS_FIELD,
    },
  }), [formData]);

  return {
    targetAction,
    testCtns,
    timeSending,
    urlAdvertiser,
    total,
    text,
    date,
    additionalInfo,
  };
};
