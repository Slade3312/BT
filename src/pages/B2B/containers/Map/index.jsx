import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { navigate } from '@reach/router';
import { StoresContext } from 'store/mobx';
import { TINDER_URL } from 'pages/constants';
import WebSocketChatConnector from 'containers/WebSocketChatConnector';
import checkForInn from 'store/mobx/requests/checkForInn';
import Sidebar from '../../containers/Sidebar';
import FullScreenModal from '../../containers/FullScreenModal';
import Modal from '../../containers/Modal';
import { AddBusiness } from '../AddBusiness/containers/AddBusiness';
import AddAction from '../AddBusiness/containers/AddAction';
import styles from './styles.pcss';

const Map = () => {
  const { Tinder, TinderChat } = useContext(StoresContext);
  const { mapPoints } = Tinder;

  const handleReceiveSocketMessage = (data) => {
    const message = data.data;

    let newMessageNotify = null;
    const chatIndex = TinderChat.chatsList.findIndex((item) => item.id === message.dialog_id);

    if (TinderChat.activeChat.id === 'new') {
      navigate(`${TINDER_URL}chats/${message.dialog_id}`);
    }

    if (TinderChat.chatsList.length === 0 || !TinderChat.activeChat.id) {
      TinderChat.set('allChatsUnreadCount', TinderChat.allChatsUnreadCount + 1);
    }

    if (chatIndex === -1) {
      TinderChat.loadGetChatById({ id: message.dialog_id });

      if (TinderChat.isAllowedNotifications) {
        newMessageNotify = new Notification(
          'В списке чатов Новый диалог!', // TODO уточнить текст оповещения
          { body: 'Чат. Beeline Продвижение', icon: 'https://static.beeline.ru/upload/images/b2c/bee-logo/single.png' },
        );
      }
    } else if (message.dialog_id === +TinderChat.activeChat.id) {
      if (TinderChat.isWindowInactive && TinderChat.isAllowedNotifications) {
        newMessageNotify = new Notification(
          'В открытом Диалоге новое сообщение!',
          { body: 'Чат. Beeline Продвижение', icon: 'https://static.beeline.ru/upload/images/b2c/bee-logo/single.png' },
        );
      }

      TinderChat.setNewMessage({
        ...message,
        files: message.files.map(item => ({ file: item })),
        id: `${message.date_time_message}-${message.sender}`,
      });
    } else {
      if (TinderChat.isWindowInactive && TinderChat.isAllowedNotifications) {
        newMessageNotify = new Notification(
          'В одном из Диалогов новое сообщение!',
          { body: 'Чат. Beeline Продвижение', icon: 'https://static.beeline.ru/upload/images/b2c/bee-logo/single.png' },
        );
      }

      TinderChat.addNewMessageToChat(chatIndex, message);
    }

    if (newMessageNotify) {
      newMessageNotify.onclick = () => {
        window.focus();
      };
    }
  };

  const handleWebsocketChatOpen = () => {
    TinderChat.set('isConnecting', false);
  };

  const handleWebsocketInit = () => {
    TinderChat.set('isConnecting', true);
  };

  function handleWebsocketError() {
    TinderChat.set('isConnecting', false);
  }

  function handleWebsocketClose() {
    TinderChat.set('isConnecting', false);
  }

  function handleWebsocketPreReconnect() {
    TinderChat.set('isConnecting', true);
  }

  function handleWebsocketReconnectLimitReached() {
    TinderChat.set('error', 'Что-то пошло не так. Не можем подключиться к чату после нескольких попыток. Пожалуйста, перезагрузите страницу.');
  }

  const handleWindowInactive = () => {
    if (document.visibilityState === 'visible') {
      TinderChat.set('isWindowInactive', false);
    } else {
      TinderChat.set('isWindowInactive', true);
    }
  };

  useEffect(() => {
    TinderChat.loadAllChatsUnreadCount();

    if (!('Notification' in window)) {
      /* eslint-disable-next-line */
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      TinderChat.set('isAllowedNotifications', true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          TinderChat.set('isAllowedNotifications', true);
        }
      });
    }

    document.addEventListener('visibilitychange', handleWindowInactive);
  }, []);

  useEffect(() => {
    Tinder.getMapPoints();
  }, []);

  useEffect(() => {
    checkForInn(null, null, { disableClose: true });
  }, []);

  useEffect(() => {
    function setOpener(e) {
      if (e.target.classList.contains('cluster-caption')) {
        const id = e.target.getAttribute('data-item');
        Tinder.openItemInFloatSidebar(id);
      }
    }
    document.body.addEventListener('click', setOpener);
    return document.body.removeEventListener('click', setOpener);
  }, []);

  useEffect(() => {
    if (Tinder.isMapPointsLoaded) {
      try {
        window.ymaps.ready(() => {
          const location = window.ymaps.geolocation.get();
          // eslint-disable-next-line
          const MyBalloonLayout = window.ymaps.templateLayoutFactory.createClass(
            `<div class=${styles.baloonContainer}>
                  <div class=${styles.baloonTitle}>{{properties.name}}</div>
                  <div class=${styles.sales}>
                    {{properties.address}}
                  </div>
                </div>`, {
            });
          const featuresCollection = {
            type: 'FeatureCollection',
            features: [],
          };
          const convertedItems = mapPoints.map(item => {
            return {
              type: 'Feature',
              id: item.id,
              geometry: {
                type: 'Point',
                coordinates: item.point,
              },
              properties: {
                clusterCaption: `<div data-item="${item.id}" class="cluster-caption">${item.name}</div>`,
                address: item.address,
                name: item.name,
                industry: item.industry,
              },
              options: {
                hintLayout: MyBalloonLayout,
                hintCloseTimeout: 300,
                iconImageSize: [50, 50],
                hintOffset: [-10, -90],
                iconLayout: 'default#image',
                iconImageHref: item.industry_icon || 'https://static.beeline.ru/upload/images/b2c/bee-logo/single.png',
              },
            };
          });

          featuresCollection.features = [...convertedItems];

          const myMap = new window.ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 11,
            controls: [],
            behaviors: ['default', 'scrollZoom'],
          }, {
            yandexMapDisablePoiInteractivity: true,
          });

          const objectManager = new window.ymaps.ObjectManager({
            gridSize: 64,
            clusterize: true,
          });

          myMap.geoObjects.add(objectManager);
          objectManager.add(featuresCollection);

          objectManager.clusters.balloon.events.add('open', () => {
            try {
              const el = document.querySelector('.cluster-caption');
              const id = el.getAttribute('data-item');
              Tinder.openItemInFloatSidebar(id);
            } catch (error) {
              console.log(error);
            }
          });

          objectManager.clusters.options.set({
            preset: 'islands#yellowClusterIcons',
          });

          objectManager.objects.events.add('click', (e) => {
            const objectId = e.get('objectId');
            Tinder.openItemInFloatSidebar(objectId);
            myMap.panTo(objectManager.objects.getById(objectId).geometry.coordinates, { useMapMargin: true });
          });

          document.querySelector('.ymaps-2-1-77-ground-pane').style.filter = 'grayscale(1)';
          location.then((result) => {
            myMap.panTo(result.geoObjects.position, { useMapMargin: true });
          });
          Tinder.map = myMap;
          Tinder.objectManager = objectManager;
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [Tinder.isMapPointsLoaded]);
  return (
    <WebSocketChatConnector
      onTinderChatOpen={handleWebsocketChatOpen}
      onTinderChatInit={handleWebsocketInit}
      onTinderChatError={handleWebsocketError}
      onTinderChatClose={handleWebsocketClose}
      onTinderChatPreReconnect={handleWebsocketPreReconnect}
      onTinderChatMessage={handleReceiveSocketMessage}
      onTinderChatReconnectLimitReached={handleWebsocketReconnectLimitReached}
    >
      <div className={styles.container}>
        <Sidebar />

        <div id="map" className={styles.map}>
          {
            Tinder.isModalPartnersOpened &&
            <Modal />
          }
        </div>

        {/*
        <Link to="chats" className={styles.messagesLink}>
          <MessagesIcon />

          Cообщения

          {TinderChat.allChatsUnreadCount !== 0 && (
            <div className={styles.unreadCount}>{TinderChat.allChatsUnreadCount}</div>
          )}
        </Link>

        <Router primary={false}>
          <ChatsListPage path="chats/*" />
        </Router>
        */}
        {
          Tinder.showModalAddBusiness &&
          <FullScreenModal>
            <AddBusiness onBack={() => { Tinder.set('showModalAddBusiness', false); }} />
          </FullScreenModal>
        }
        {
          Tinder.showModalAddAction &&
          <FullScreenModal>
            <AddAction onBack={() => { Tinder.set('showModalAddAction', false); }} />
          </FullScreenModal>
        }
      </div>
    </WebSocketChatConnector>
  );
};

export default observer(Map);
