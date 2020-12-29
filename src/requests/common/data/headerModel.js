import { WEBINAR, MY_CAMPAIGNS_URL, TINDER_URL, NEW_CAMPAIGN_URL } from 'pages/constants';

export default {
  mainSiteLink: '/dashboard',
  helpLinkTitle: 'Помощь',
  helpLinkHref: '/faq',
  mainMenu: [
    {
      title: 'Создать кампанию',
      href: NEW_CAMPAIGN_URL,
    }, {
      title: 'Мои кампании',
      href: MY_CAMPAIGNS_URL,
    },
    {
      title: 'Обучение',
      href: WEBINAR,
    },
    {
      title: 'Бизнес.Вместе',
      href: TINDER_URL,
    },
  ],
  blocks: {
    profile: {
      title: 'Профиль',
      links: [
        {
          title: 'Настройки',
          href: '/user-info/',
        },
        {
          title: 'Выход',
          isLogout: true,
        },
      ],
    },
  },
};
