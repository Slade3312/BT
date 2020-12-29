export const OFFER_CHECKED_FIELD = 'isChecked';

export const CHANNEL_STUB_INTERNET = 'internet';
export const CHANNEL_STUB_VOICE = 'voice-target';
export const CHANNEL_STUB_TARGET_INTERNET = 'target-internet';
export const CHANNEL_STUB_SMS = 'target-sms';
export const CHANNEL_STUB_PUSH = 'push';
export const CHANNEL_STUB_FOCUS = 'focus';
export const CHANNEL_STUB_POLL = 'poll';

export const CAMPAIGN_START = 'campaignStart';

export const CAMPAIGN_STATUSES = {
  DRAFT: 5,
  COMPLETED: 7,
  ON_APPROVAL: 1,
};

export const ORDER_STATUSES = {
  COMPLETED: 5,
  CANCELED: 3,
  CREATED: 0,
  IN_PROGRESS: 7,
};

export const DISTANCE_TO_NEAREST_ERROR_FIELD = 40;

export const GEO_TYPES = {
  REGIONS: 'regions',
  POINTS: 'points',
};

export const geoActionOptions = [
  { value: GEO_TYPES.REGIONS, label: 'Города и регионы' },
  { value: GEO_TYPES.POINTS, label: 'Указать точный адрес' },
];

export const PROMOCODE_VALUES_TYPES = {
  PERCENT: 0,
  UNIT: 1,
  COUNT: 2,
};

export const PROMOCODE_TYPES = {
  PARTICULAR: 1,
  TOTAL: 0,
};
