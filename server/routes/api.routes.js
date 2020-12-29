const { userInfoDb } = require('../db/index');
const { connectionTypes, callMethods, activityFields } = require('./stubs/newVoice/newVoice');
const { isValidSelection } = require('./validators');
const { floatRoundOff, getRndFloat, getRnd } = require('./utils');
const focusSettingsSlug = require('./stubs/report__report_data.json');
const campaignWithFocusSlug = require('./stubs/campaign__withFocusOrder.json');
const campaignModel = require('./stubs/campaigns/campaignModel.json');
const campaignsOrdersDataSlug = require('./stubs/campaigns__orders.json');
const createCampaignResponse = require('./stubs/campaigns_post.json');
const emptyOrderBrandFiles = require('./stubs/empty_order-brandfiles.json');
const checkPromocode = require('./stubs/client__campaigns__check_promo_code.json');
const infotechIndustries = require('./stubs/infotech/infotech__industries.json');
const infotechTools = require('./stubs/infotech/infotech__tools.json');
const campaignSendInternetBrief = require('./stubs/campaigns/send_internet_brief.json');
const pollsTariffs = require('./stubs/polls/tariffs.json');
const webinarsList = require('./stubs/client__webinars.json');
const chatMessages = require('./stubs/client/chat_messages.json');
const myTargetIndustries = require('./stubs/my_target_industries.json');
const myTargetTariffs = require('./stubs/myTarget/tariffs.json');
const myTargetButtons = require('./stubs/myTarget/buttons.json');
const companyDialogs = require('./stubs/client/company_dialogs.json');
const companyMessages = require('./stubs/client/company_messages.json');

const {
  templateCommon,
  templateUserInfo,
  templateDashboard,
  templateNewCampaign,
  templateMyCampaigns,
  templateAudienceStatistic,
  templateError,
  templateNotifications,
  templatePopups,
  templatePolls,
  templateChat,
} = require('./stubs/templates');

const AuthTokenCookieName = 'id_token';

const withPrefix = (prefix, slug) => `${prefix}${slug}`;
const withoutPrefix = (prefix, filename) =>
  filename.indexOf(prefix) === 0 ? filename.substring(prefix.length) : '__noFile__';

const VALIDATION_ERROR_MODE = 'validation';
const VALIDATION_GLOBAL_ERROR_MODE = 'gvalidation';
const GLOBAL_ERROR_MODE = 'failure';

const MODE = null;
// const MODE = VALIDATION_ERROR_MODE;
// const MODE = VALIDATION_GLOBAL_ERROR_MODE;
// const MODE = GLOBAL_ERROR_MODE;

const debugResponse = (req, res) => {
  switch (MODE) {
    case VALIDATION_ERROR_MODE:
      return res.status(400).json({ name: 'Validation error test' });
    case VALIDATION_GLOBAL_ERROR_MODE:
      return res.status(400).json({ detail: 'BadAss error test' });
    case GLOBAL_ERROR_MODE:
      return res.status(500).send('500 bad stuff');
    default:
      return null;
  }
};

module.exports = [
  {
    url: '/api/v1/*',
    handler: (req, res, next) => {
      const AuthToken = req.cookies[AuthTokenCookieName];
      if (AuthToken === '403') {
        res.status(403).send();
      } else if (AuthToken === '404') {
        res.status(404).send();
      } else if (AuthToken === '401') {
        res.status(401).send();
      }
      next();
    },
  },
  {
    url: '/api/v1/my_target/industries/',
    handler: (req, res) => res.status(201).json(myTargetIndustries),
  },
  {
    url: '/api/v1/client/businesses/',
    handler: (req, res) => {
      return setTimeout(() => {
        res.status(200).json({
          count: 4,
          next: null,
          previous: null,
          results: [{
            id: 1,
            name: 'JAB Кальяны',
            point: [55.751574, 37.573856],
            phone: '+799999999999',
            address: 'Улица Пушкина, дом Колотушкина',
            description: 'Фирменные кальяны по доступной цене',
            site: 'https://parugdehochu.ru',
            industry: 5,
          }, {
            id: 2,
            name: 'Пиццерия "Осторожно, Модерн"',
            point: [55.576669, 37.329032],
            phone: '+799999999999',
            address: 'Улица Красивых Молдавских Партизан',
            description: 'Лучшая итальянская пицца из Бибирево',
            site: 'https://zadov.ru',
            industry: 5,
          }],
        });
      }, 2000);
    },
  },
  {
    url: '/api/v1/client/businesses/points/',
    handler: (req, res) => res.status(200).json([{
      name: 'JAB Кальяны',
      industry: 5,
      address: 'Улица Пушкина, дом Колотушкина',
      point: [55.751574, 37.573856],
      id: 1,
    }, {
      name: 'The Blue Oyster Gym',
      industry: 20,
      address: 'пр. Ивана Карпова',
      point: [55.930262, 37.329032],
      id: 3,
    }, {
      name: 'Пиццерия "Осторожно, Модерн"',
      industry: 5,
      address: 'Улица Красивых Молдавских Партизан',
      point: [55.576669, 37.329032],
      id: 2,
    }, {
      name: 'Качалка "Бродяга"',
      industry: 20,
      address: 'Улица Льва Николаевича Толстого',
      point: [55.576669, 37.911307],
      id: 4,
    }]),
  },
  {
    url: '/api/v1/client/business/',
    handler: (req, res) => {
      return setTimeout(() => {
        res.status(200).json({
          business_id: 1,
        });
      }, 2000);
    },
  },
  {
    url: '/api/v1/client/actions/',
    handler: (req, res) => {
      return setTimeout(() => {
        res.send(200);
      }, 2000);
    },
  },
  {
    url: '/api/v1/client/businesses/:id',
    handler: (req, res) => {
      return setTimeout(() => {
        res.status(200).json({
          id: 3,
          created_date: '2020-09-17 15:17',
          name: 'Пиццерия "Осторожно, Модерн"',
          point: [55.576669, 37.329032],
          phone: '+79999999999',
          address: 'Улица Красивых Молдавских Партизан',
          description: 'Лучшая итальянская пицца из Бибирево',
          site: 'https://zadov.ru',
          image: null,
          offer: false,
          moderation_status: 1,
          company: 1,
          industry: 5,
          business_actions: [
            {
              id: 5,
              display_discount_type: 'Money',
              business_id: 1,
              created_date: '2020-09-22 08:56',
              date_start: '2020-09-23',
              date_end: '2020-09-24',
              description: 'test action api',
              discount_type: 0,
              discount_size: '1000.00',
              name: 'new api test',
              spread_type: 2,
            },
            {
              id: 4,
              display_discount_type: 'Money',
              business_id: 1,
              created_date: '2020-09-22 08:04',
              date_start: '2020-09-23',
              date_end: '2020-09-24',
              description: 'test action api',
              discount_type: 0,
              discount_size: '1000.00',
              name: 'new api test',
              spread_type: 2,
            },
            {
              id: 3,
              display_discount_type: 'Percent',
              business_id: 1,
              created_date: '2020-09-18 12:39',
              date_start: '2020-09-19',
              date_end: '2020-09-19',
              description: 'zxcv',
              discount_type: 1,
              discount_size: '15.00',
              name: 'qwedcxz',
              spread_type: 2,
            },
            {
              id: 1,
              display_discount_type: 'Money',
              business_id: 1,
              created_date: '2020-09-18 11:16',
              date_start: '2020-09-18',
              date_end: '2020-09-18',
              description: 'test',
              discount_type: 0,
              discount_size: '1000.00',
              name: 'test',
              spread_type: 2,
            },
          ],
          industry_icon: 'http://127.0.0.1/media/industries_icons/photo_2020-09-03_15-28-02.jpg',
        });
      }, 2000);
    },
  },
  {
    url: '/api/v1/my_target/industries_docs_files',
    handler: (req, res) => {
      if (req.method === 'POST') {
        return setTimeout(() => {
          res.status(200).json({
            id: 8,
            industry_docs: req.body.industry_docs,
            file_name: 'Ультра Лицензия ООО Магазин',
            file_size: 32134,
            file_extension: 'PDF',
          });
        }, 500);
      }
      return res.status(400).json({ detail: 'Incorrect method' });
    },
  },
  {
    url: '/api/v1/my_target/industries_docs_files/:id',
    handler: (req, res) => {
      if (req.method !== 'DELETE') {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(405).json({ detail: 'STUB: Only DELETE is supported for /my_target/industries_docs_files/:id' });
      }
      return res.status(200).json(req.body);
    },
  },
  {
    url: '/api/v1/client/poll_tariffs/',
    handler: (req, res) => res.json(pollsTariffs),
  },
  {
    url: '/api/v1/client/campaigns/create_poll/',
    handler: (req, res) => res.status(201).json({}),
  },
  {
    url: '/api/v1/client/webinars/register/',
    handler: (req, res) => res.status(201).json({}),
  },
  {
    url: '/api/v1/client/campaigns/:id/orders_audience/target-sms/',
    handler: (req, res) => res.status(200).json({ audience: Math.floor(Math.random() * 1000) }),
  },
  {
    url: '/api/v1/client/orders/check_ctn/',
    handler: (req, res) => res.json({
      ctn: req.body.ctn,
      is_beeline: !!Math.round(Math.random()),
      message: 'В качестве тестовых могут использоваться только номера Билайн',
    }),
  },
  {
    url: '/api/v1/infotech/industries/',
    handler: (req, res) => res.status(200).json(infotechIndustries),
  },
  {
    url: '/api/v1/client/company_docs/doc_types',
    handler: (req, res) => res.status(200).json([
      'Паспорт РФ',
      'Военный билет',
      'Удостоверение личности',
      'Паспорт иностранного гражданина',
      'Паспорт СССР',
      'Заграничный паспорт РФ',
      'Вид на жительство',
    ]),
  },
  {
    url: '/api/v1/infotech/tools/',
    handler: (req, res) => res.status(200).json(infotechTools),
  },
  {
    url: '/api/v1/offer',
    getSlug: () => 'offer',
  },
  {
    url: '/api/v1/client/campaigns/get_short_link/',
    handler: (req, res) => {
      const shortLink = `${getRnd(0, 9)}${getRnd(0, 9)}${getRnd(0, 9)}${getRnd(0, 9)}${getRnd(0, 9)}`;
      setTimeout(() => {
        res.status(200).json({ shortURL: `https://beel.ink/${shortLink}` });
      }, 300);
    },
  },
  {
    url: '/api/v1/client/campaigns/creation_request/',
    handler: (req, res) => res.send(200),
  },
  {
    url: '/api/v1/settings/holidays/',
    getSlug: () => 'holidays',
  },
  {
    url: '/api/v1/bigdata/:slug',
    getUrl: slug => `/api/v1/bigdata/${slug}`,
    getSlug: req => req.params.slug,
  },
  {
    url: '/api/v1/client/:slug(channel_types)',
    getUrl: slug => `/api/v1/client/${withoutPrefix('client__', slug)}`,
    getSlug: req => withPrefix('client__', req.params.slug),
  },
  {
    url: '/api/v1/client/campaigns/',
    handler: (req, res) => {
      if (req.method === 'GET') {
        return setTimeout(() => res.status(200).json(campaignsOrdersDataSlug), 200);
      }
      if (req.method !== 'POST') return res.status(405).json({ detail: 'STUB: Only POST is supported on list url' });
      if (MODE !== null) return debugResponse(req, res);
      return res.status(201).json(createCampaignResponse);
    },
  },
  {
    url: '/api/v1/client/orders/:id/activation/',
    // eslint-disable-next-line consistent-return
    handler: (req, res) => {
      if (req.method !== 'POST') return res.status(405).json({ detail: 'STUB: Only POST is supported on list url' });
      if (MODE !== null) return debugResponse(req, res);
      setTimeout(() => {
        res.status(201).json({
          is_active: req.body.is_active,
        });
      }, 300);
    },
  },
  {
    url: '/api/v1/client/chat_messages/',
    handler: (req, res) => {
      res.status(200).json(chatMessages);
    },
  },
  {
    url: '/chat/is_work_time',
    handler: (req, res) => {
      res.status(200).json({ is_work_time: true });
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/check_promo_code/',
    handler: (req, res) => {
      if (req.params.id && req.body.promo_code) {
        setTimeout(() => {
          res.status(200).json(checkPromocode);
        }, 300);
      } else {
        res.status(400).send();
      }
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/send_internet_brief/',
    // eslint-disable-next-line consistent-return
    handler: (req, res) => {
      if (req.method !== 'POST') return res.status(405).json({ detail: 'Only POST is supported on list url' });
      setTimeout(() => {
        res.status(200).json(campaignSendInternetBrief);
      }, 300);
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/orders_audience/push/',
    handler: (req, res) => res.status(200).json({ audience: getRndFloat(5000, 10000) }),
  },
  {
    url: '/api/v1/client/check_promo_code/',
    handler: (req, res) => res.status(200).json({
      context_params: null,
      date_end: '2020-08-28',
      date_start: '2020-08-27',
      one_time_client: false,
      promo_code: 'TEST 9975',
      promo_code_value: 20,
      promo_code_value_type: 'процент',
      promo_code_value_type_id: 0,
      promo_type_id: 1,
      reusable: true,
    }),
  },

  {
    url: '/api/v1/client/campaigns/statuses/',
    getSlug: () => 'client__campaigns__statuses',
  },
  {
    url: '/api/v1/client/orders/statuses/',
    getSlug: () => 'client__orders__statuses',
  },
  {
    url: '/api/v1/client/webinars/schedule/',
    handler: (req, res) => {
      if (req.method !== 'GET') throw new Error('Method Not Allowed');
      res.send(webinarsList);
    },
  },
  {
    url: '/api/v1/client/campaigns/create_audience_profiling/',
    handler: (req, res) => {
      if (req.method === 'POST') {
        return res.status(200).json(campaignWithFocusSlug);
      }
      return res.status(400).json({ detail: 'Incorrect method' });
    },
  },
  {
    url: '/api/v1/client/campaigns/:id',
    handler: (req, res) => {
      if (req.method === 'GET') {
        return setTimeout(() => res.status(200).json({ ...campaignModel, id: req.params.id }), 500);
      }
      if (req.method === 'DELETE') {
        return res.status(200).json({ ...campaignWithFocusSlug, id: req.params.id });
      }
      if (req.method !== 'PUT') return res.status(405).json({ detail: 'STUB: Only PUT is supported on instance url' });
      if (req.body && req.body.id) {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(200).json(req.body);
      }
      return res.status(400).json({ detail: 'STUB: id required for PUT requests' });
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/selection/',
    handler: (req, res) => {
      if (req.method !== 'PUT') return res.status(405).json({ detail: 'STUB: Only PUT is supported for selections' });
      if (isValidSelection(req.body)) {
        const audience = Math.floor(10000000)
            / (Object.keys(req.body.data).length + 1) / (10 / JSON.stringify(req.body.data).length);
        return setTimeout(
          () =>
            res.status(200).json({
              audience,
              selection_id: Math.round(Math.random() * 1000),
              budgets: {
                'target-sms': Math.round(Math.random() * 1000),
                internet: Math.round(Math.random() * 1000),
                'voice-target': 30000,
                focus: 1,
                push: Math.round(Math.random() * 1000),
              },
            }),
          100,
        );
      }
      return res.status(400).json({ detail: 'STUB: validation error' });
    },
  },
  {
    url: '/api/v1/settings/templates/',
    handler: (req, res) => {
      const AuthToken = req.cookies[AuthTokenCookieName];
      try {
        if (req.method !== 'GET') throw new Error('Method Not Allowed');
        switch (req.query.name) {
          case 'common':
            return res.send(templateCommon);
          case 'userInfo':
            return res.send(templateUserInfo);
          case 'dashboard':
            return res.send(templateDashboard);
          case 'newCampaign':
            return res.send(templateNewCampaign);
          case 'myCampaigns':
            return res.send(templateMyCampaigns);
          case 'audienceStatistic':
            return res.send(templateAudienceStatistic);
          case 'chat':
            return res.send(templateChat);
          case 'errors':
            if (!AuthToken) {
              return res.status(401).send();
            }
            return res.send(templateError);
          case 'notifications':
            return res.send(templateNotifications);
          case 'popups':
            return res.send(templatePopups);
          case 'polls':
            return res.send(templatePolls);
          default:
            return res.status(510).send({ message: 'The name parameter is unknown' });
        }
      } catch (e) {
        return res.status(405).json(e);
      }
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/orders/:slug',
    handler: (req, res, next) => {
      switch (req.method) {
        case 'PUT':
          return setTimeout(() => {
            if (MODE !== null) return debugResponse(req, res);
            return res.send({
              order_id: Math.ceil(Math.random() * 9999),
              ...req.body,
              is_empty: false,
            });
          }, 2000);
        case 'DELETE':
          return setTimeout(
            () =>
              res.send({
                order_id: Math.ceil(Math.random() * 9999),
                deleted: true,
              }),
            2000,
          );
        default:
          return next();
      }
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/start/',
    handler: (req, res) => setTimeout(() => {
      if (MODE !== null) return debugResponse(req, res);
      return res.status(200).send({ detail: 'Server error' });
    }, 1000),
  },
  {
    url: '/api/v1/client/campaigns/:id/custom_segment/:id',
    handler: (req, res) => {
      if (req.method !== 'PUT') {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(405).json({ detail: 'STUB: Only PUT is supported for custom_segment' });
      }
      return res.status(200).json(req.body);
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/custom_segment/:id/files',
    handler: (req, res) => {
      if (req.method === 'POST') {
        return setTimeout(() => {
          res.status(200).json({
            file: 'some_file.docx',
            id: 'mem lol',
            items_count: 45,
            type: 'docx',
          });
        }, 500);
      }
      if (req.method === 'DELETE') {
        return res.status(200).send();
      }
      return res.status(400).json({ detail: 'Incorrect method' });
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/custom_segment/:id/files/:id',
    handler: (req, res) => {
      if (req.method !== 'DELETE') {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(405).json({ detail: 'STUB: Only DELETE is supported for /campaigns/:id/custom_segment/:id/files/:id' });
      }
      return res.status(200).json(req.body);
    },
  },
  {
    url: '/api/v1/client/campaigns/:id/mediaplan_comment/',
    handler: (req, res) => {
      if (req.method !== 'POST') {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(405).json({ detail: 'STUB: Only POST is supported for mediaplan_comment' });
      }
      return res.status(200).send();
    },
  },
  {
    url: '/api/v1/user-info/',
    handler(req, res) {
      if (MODE === GLOBAL_ERROR_MODE) return debugResponse(req, res);
      if (req.method === 'PUT') {
        if (MODE !== null) return debugResponse(req, res);
        return res.status(200).json(req.body);
      }
      if (req.method === 'GET') {
        return res.status(200).json(userInfoDb.getData('/'));
      }
      return res.status(400).json({ detail: 'Incorrect method' });
    },
  },
  {
    url: '/api/v1/user-info/:id/check-inn/',
    handler(req, res) {
      return res.status(200).json({ inn_exists: false, docs_needed: true });
    },
  },
  {
    url: '/api/v1/user-info/:id/offer-accepted',
    handler(req, res) {
      if (MODE === GLOBAL_ERROR_MODE) return debugResponse(req, res);
      if (req.method === 'POST') {
        userInfoDb.push('/offer_accepted_date', '2019-10-15, 14:26:37');
        return res.status(200).send();
      }
      return res.status(400).json({ detail: 'Incorrect method' });
    },
  },
  {
    url: '/constants/',
    getSlug: () => 'constants',
  },
  {
    url: '/api/v1/client/orders/calculate',
    handler: (req, res) => {
      if (!req.body.selection_id) {
        return res.status(400).json({ selection_id: ['Это поле обязательно.'] });
      }
      if (req.body.channel_uid === 'internet') {
        const events = [...Array(8).keys()].reduce(
          (acc, id) => ({
            ...acc,
            [id + 1]: {
              qty_min: Math.round(getRndFloat(50000, 100000)),
              qty_max: Math.round(getRndFloat(500000, 1000000)),
            },
          }),
          {},
        );
        return res.status(200).json({
          tools_events: events,
          total_events: {
            qty_min: Math.round(getRndFloat(50000, 100000)),
            qty_max: Math.round(getRndFloat(500000, 1000000)),
          },
          total_budget: Math.round(getRndFloat(500000, 1000000)),
        });
      }

      if (req.body.channel_uid === 'voice-target') {
        const eventCost = 53.45;
        const qty = req.body.budget / eventCost;

        return res.status(200).json({
          qty,
          event_cost: eventCost,
        });
      }

      return res.status(200).json(Math.random() < 0.5
        ? {
          min_qty: getRndFloat(50000, 100000),
          max_qty: getRndFloat(100000, 200000),
          event_cost: floatRoundOff(getRndFloat(1000, 10000), 2),
        }
        : {
          qty: getRndFloat(5000, 20000),
          event_cost: floatRoundOff(getRndFloat(1000, 10000), 2),
        });
    },
  },
  {
    url: '/api/v1/report/report_data/',
    handler: (req, res) =>
      setTimeout(() => {
        res.status(200).json(focusSettingsSlug);
      }, 500),
  },
  {
    url: '/api/v1/client/campaigns/:campaignId/calculate_segment_volume/:channelUid/',
    handler: (req, res) => {
      setTimeout(() => res.status(200).json({ quantityMin: 1000, quantityMax: 10000 }), 200);
    },
  },
  {
    url: '/api/v1/client/campaigns/:campaignId/empty_order/',
    handler: (req, res) => {
      setTimeout(
        () =>
          res.status(200).json({
            // eslint-disable-next-line no-bitwise
            order_id: ~~(Math.random() * 1000),
            is_empty: true,
            files: emptyOrderBrandFiles,
          }),
        300,
      );
    },
  },
  {
    url: '/api/v1/client/campaigns/:campaignId/check_ctn_count/',
    handler: (req, res) => {
      setTimeout(() => res.status(200).json({}), 100);
    },
  },
  {
    url: '/api/v1/client/campaigns/:channelUid/create_segment/:channelType/',
    handler: (req, res) => res.status(200).json(10),
  },
  {
    url: '/api/v1/client/industry/',
    getSlug: () => 'client__industry',
  },
  {
    url: '/api/v1/client/order_files/',
    handler: (req, res) =>
      setTimeout(() => {
        res.json({
          // eslint-disable-next-line no-bitwise
          id: ~~(Math.random() * 1000),
          file: 'https://marketing.kube.vimpelcom.ru/media/order_files/IMG_8668.jpg',
          company: 18,
        });
      }, 300),
  },
  {
    url: '/api/v1/client/order_files/:fileId/',
    handler: (req, res) => res.status(204).end(),
  },
  {
    url: '/api/v1/client/company_docs/',
    handler: (req, res) =>
      res.status(200).json({
        id: parseInt(Math.random() * 10000, 10),
        file: 'http://static.beeline.ru/upload/images/marketing/BEEprodvijenie.svg',
      }),
  },
  {
    url: '/api/v1/client/feedback/',
    handler: (_, res) => setTimeout(() => res.status(200).end(), 2000),
  },
  {
    url: '/api/v1/my_target/tariffs/',
    handler: (_, res) => setTimeout(() => res.status(200).json(myTargetTariffs), 1000),
  },
  {
    url: '/api/v1/my_target/buttons/',
    handler: (req, res) => res.status(200).json(myTargetButtons),
  },
  {
    url: '/api/v1/user-info/:id/account-update/',
    handler: (req, res) => res.status(200).send(),
  },
  {
    url: '/api/v1/faq/categories/',
    getSlug: () => 'faq__categories',
  },
  {
    url: '/api/v1/client/voice_industries/connection_types/',
    handler: (req, res) => res.status(200).json(connectionTypes),
  },
  {
    url: '/api/v1/client/voice_industries/',
    handler: (req, res) => res.status(200).json(activityFields),
  },
  {
    url: '/api/v1/client/voice_industries/call_methods/',
    handler: (req, res) => res.status(200).json(callMethods),
  },
  {
    url: '/api/v1/client/company_dialogs/',
    handler: (req, res) => res.status(200).json(companyDialogs),
  },
  {
    url: '/api/v1/client/company_messages/',
    handler: (req, res) => res.status(200).json(companyMessages),
  },
  {
    url: '/api/v1/client/company_dialogs/unread_message_count/',
    handler: (req, res) => res.status(200).json({ count: 48 }),
  },
  {
    url: '/api/v1/*',
    type: 'proxy',
  },
  {
    url: '/authorize/',
    handler: (req, res) => {
      res.redirect(req.headers.referer);
    },
  },
  {
    url: '/static/templates/example.txt/',
    handler: (req, res) => res.status(200).send('Hello world'),
  },
];
