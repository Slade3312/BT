/* eslint-disable */
import { AUDIENCE_STATISTIC_URL } from 'pages/constants';

export const data = {
  audienceAnalysisBanner: {
    title: 'Анализ аудитории',
    href: AUDIENCE_STATISTIC_URL,
    description: {
      content: 'Загрузите телефонные номера ваших клиентов и получите отчёт по 17 параметрам. Узнавайте пол, возраст, интересы, уровень дохода и другую информацию о покупателях на основании «больших данных» Билайн.',
      isWide: true,
    },
    button: {
      text: 'Перейти к анализу аудитории',
      isLight: true,
    },
    price: {
      value: 4800,
      unit: '₽',
    },
    background: {
      image: 'https://static.beeline.ru/upload/images/marketing/owl.jpg',
    },
    isHoverable: true,
  }
};
