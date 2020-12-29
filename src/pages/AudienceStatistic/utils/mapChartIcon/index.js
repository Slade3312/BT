import { ChartIcons } from './constants';

export const mapChartIcon = (labelName) => {
  switch (labelName) {
    // media services
    case 'Социальные сети':
      return ChartIcons.FACEBOOK;

    case 'Мессенджеры': {
      return ChartIcons.WHATS_APP;
    }
    case 'Магазины приложений (AppStore, GooglePlay...)': {
      return ChartIcons.MOBILE_GAME;
    }
    case 'Онлайн-кинотеатры': {
      return ChartIcons.ONLINE_CINEMA;
    }
    case 'Навигаторы': {
      return ChartIcons.NAVIGATOR;
    }
    case 'Видеохостинги (YouTube, Rutube...)': {
      return ChartIcons.VIDEO_HOSTING;
    }
    case 'Музыкальные сервисы': {
      return ChartIcons.MUSIC_SERVICE;
    }
    // social networks
    case 'Instagram': {
      return ChartIcons.INSTAGRAM;
    }
    case 'Одноклассники': {
      return ChartIcons.OK;
    }
    case 'ВКонтакте': {
      return ChartIcons.VK;
    }
    case 'Telegram': {
      return ChartIcons.TELEGRAM;
    }
    case 'Skype': {
      return ChartIcons.SKYPE;
    }
    case 'Viber': {
      return ChartIcons.VIBER;
    }
    case 'Whatsapp': {
      return ChartIcons.WHATS_APP;
    }
    case 'Facebook': {
      return ChartIcons.FACEBOOK;
    }
    default: {
      return null;
    }
  }
};
