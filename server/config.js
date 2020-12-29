const settings = {
  MAIN_SITE_URL: 'http://marketing.kube.vimpelcom.ru',
};

module.exports = {
  MAIN_SITE_URL: settings.MAIN_SITE_URL.replace(/.*::/, ''),
};
