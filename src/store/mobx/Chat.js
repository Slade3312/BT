import { observable, runInAction, action, computed } from 'mobx';
import { chatMessagesRequest } from 'requests/chat';
import { checkIsUserMessage } from 'containers/WebSocketChatConnector/utils';
import { getFormattedDate } from 'utils/date';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { webNotifications } from 'modules';

let notificationNextId = 0;
const NOTIFICATION_HIDE_TIME = 10000;
const markedDelayedTimerIds = {};

class Chat {
  @observable.ref webSocketConnector = null;
  @observable.shallow messages = [];
  @observable pinnedFiles = [];
  @observable attachmentsError = null
  @observable notifications = [];
  @observable nextUrl = '';
  @observable messagesLoading = false;
  @observable error = '';
  @observable message = '';
  @observable notReadMessagesCount = 0;
  @observable isChatWidgetOpen = false;
  @observable chatTypingMessage = null;
  @observable settings = {
    isLoaded: false,
    isLoading: false,
    isWorkTime: false,
  };
  @observable isMessageSending = false;

  // flag for websocket connecting
  @observable isConnecting = false;

  @computed get hasSomeUserMessage() {
    return Boolean(this.messages.find(elem => checkIsUserMessage(elem)));
  }

  @computed get allMessagesWithDatesAndSystemInfo() {
    const results = [];

    this.messages.reverse().forEach((element, index, mappedArray) => {
      if (index === 0) {
        results.push({
          files: [],
          id: '0-date',
          message: element.date_time_message,
          date_time_message: element.date_time_message,
          isDateMessage: true,
          isFirst: true,
        });
      }
      if (
        index >= 1 && !mappedArray[index - 1].isDateMessage &&
          element.date_time_message && mappedArray[index - 1]?.date_time_message &&
          getFormattedDate(element.date_time_message) !== getFormattedDate(mappedArray[index - 1]?.date_time_message)
      ) {
        results.push({
          files: [],
          id: `${element.id}-date`,
          message: element.date_time_message || Date.now(),
          date_time_message: element.date_time_message,
          isDateMessage: true,
        });
      }
      results.push(element);
    });

    return results;
  }

  @action set = (value, property) => {
    this[value] = property;
  }

  @action resetChatMessagesAndHistory = () => {
    this.nextUrl = '';
    this.messages = [];
  }

  @action pushNotification = ({ author, message, avatar, type }) => {
    if (!this.isChatWidgetOpen) {
      this.notifications.unshift({ author, message, avatar, type, id: notificationNextId++ });
    }

    if (type !== 'defaultMessage') {
      webNotifications.pushNotificationIfAllowed(`Билайн Бизнес: ${author}`, { body: message, icon: avatar });
    }
  }

  @action removeNotification = (value) => {
    this.notifications.remove(value);
  }

  @action delayedRemoveNotification = (value) => {
    if (!markedDelayedTimerIds[value.id]) {
      setTimeout(() => {
        runInAction(() => {
          this.removeNotification(value);
        });
      }, NOTIFICATION_HIDE_TIME);
      markedDelayedTimerIds[value.id] = true;
    }
  }

  @action removeAllNotifications = () => {
    this.notifications.clear();
  }

  @action addNotReadMessageCount = () => {
    this.notReadMessagesCount += 1;
  }

  @action resetNotReadMessages = () => {
    this.notReadMessagesCount = 0;
  }

  @action addNewMessage = (value) => {
    this.messages.unshift(value);
  }

  @action addPinnedFiles = (files) => {
    files.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onloadend = () => {
        runInAction(() => {
          this.pinnedFiles.push({
            file,
            name: file.name,
            url: fileReader.result,
            id: file.lastModified,
          });
        });
      };
    });
  }

  @action removePinnedFile = (file) => {
    this.pinnedFiles.remove(file);
  }

  @action loadChatSettings = async () => {
    this.settings.isLoading = true;

    try {
      const data = await axiosAuthorizedRequest({
        method: 'POST',
        url: '/chat/is_work_time',
        data: {},
      }, { isIgnoreErrors: true });

      runInAction(() => {
        this.settings.isWorkTime = data.is_work_time;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
        this.settings.isLoaded = true;
        this.settings.isLoading = false;
      });
    }
  }

  @action loadMessagesHistory = async () => {
    this.messagesLoading = true;

    try {
      const messagesHistory = await chatMessagesRequest(this.nextUrl);

      runInAction(() => {
        this.messages.push(...messagesHistory.results);

        this.nextUrl = messagesHistory.next
          ? `${new URL(messagesHistory.next).pathname}${new URL(messagesHistory.next).search}`
          : '';
      });
    } catch (e) {
      if (this.messages.length === 0) {
        runInAction(() => { this.error = e.message; });
      }
    } finally {
      runInAction(() => { this.messagesLoading = false; });
    }
  }

  persistDefaultNotificationConfirmed = () => {
    localStorage.setItem('isDefaultChatNotificationConfirmed', 'true');
  }
}

const chatStore = new Chat();

export default chatStore;
