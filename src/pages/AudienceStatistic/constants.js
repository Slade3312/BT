import { STATIC_URL } from 'requests/constants';
import { convertMbToBytes } from 'utils/fn';

export const CHANNEL_TYPE_FOCUS_TYPE_ID = 3;
export const CHANNEL_TYPE_FOCUS = 'focus';

export const REPORTS_LIST_ID = 'reports-list';

export const STATIC_LINKS = {
  EXAMPLE_CSV: 'https://static.beeline.ru/upload/images/marketing/example.csv',
  EXAMPLE_TXT: `${STATIC_URL}templates/example.txt`,
  EXAMPLE_XLSX: 'https://static.beeline.ru/upload/images/marketing/example.xlsx',
};


export const focusFileSizeMegabytes = 20;
export const focusFileSizeBytes = convertMbToBytes(focusFileSizeMegabytes);
