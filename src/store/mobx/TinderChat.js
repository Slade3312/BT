import { navigate } from '@reach/router';
import { observable, action, runInAction } from 'mobx';
import { TINDER_URL } from 'pages/constants';
import { axiosAuthorizedRequest } from 'requests/helpers';

import UserInfo from './UserInfo';

class TinderChat {
  @observable.ref webSocketConnector = null;
  @observable isAllowedNotifications = false;
  @observable isWindowInactive = false;

  @observable.shallow chatsList = [];
  @observable.shallow activeChatMessagesList = [];
  @observable previewFilesToSend = [];

  @observable allChatsUnreadCount = 0;
  @observable nextLoadMessagesUrl = '';
  @observable activeChat = {
    id: '',
    interlocutor: null,
    name: '',
  };
  @observable newMessage = {
    id: '',
    date_time_message: '',
  };

  @observable isMessagesLoading = false;
  @observable isChatsLoading = true;
  @observable isConnecting = false;
  @observable isFilesLoading = false;

  @observable activeChatError = '';
  @observable chatsListError = '';
  @observable webSocketError = '';
  @observable loadFilesError = '';


  @action set = (value, property) => {
    this[value] = property;
  }

  @action setActiveChat = (property, value) => {
    this.activeChat[property] = value;
  }

  @action setActiveChatData = (chatId) => {
    const newActiveChat = this.chatsList?.find((chatItem) => +chatItem.id === +chatId);
    this.activeChat.interlocutor = newActiveChat?.company_one;
    this.activeChat.name = newActiveChat?.dialog_name;
  }

  @action setNewMessage = (value) => {
    this.activeChatMessagesList.push(value);

    this.newMessage = value;
  }

  @action addPreviewFile = (fileObject) => {
    this.previewFilesToSend.push(fileObject);
  }

  @action removePreviewFile = (fileObject) => {
    this.previewFilesToSend.remove(fileObject);
  }

  @action unshiftNewChat = (newChatObject) => {
    this.chatsList.unshift(newChatObject);
  }

  @action addNewMessageToChat = (chatIndex, message) => {
    this.chatsList.replace(this.chatsList.map((elem, index) => {
      if (index === chatIndex) {
        const prevNewMessages = elem.newMessages || [];
        return {
          ...elem,
          newMessages: [
            ...prevNewMessages,
            message,
          ],
        };
      }

      return elem;
    }));
  }

  @action loadChatsList = async () => {
    this.isChatsLoading = true;

    try {
      const newChatsList = await axiosAuthorizedRequest({ url: '/api/v1/client/company_dialogs/' });

      runInAction(() => {
        this.chatsList = newChatsList.results;
        this.chatsListError = '';
      });
    } catch (e) {
      runInAction(() => {
        this.chatsListError = e.message;
      });
    } finally {
      runInAction(() => {
        this.isChatsLoading = false;
      });
    }
  };

  @action loadGetChatById = async ({ id, isActive }) => {
    try {
      this.isChatsLoading = true;

      const newChat = await axiosAuthorizedRequest({
        url: `/api/v1/client/company_dialogs/${id}/`,
      });

      if (isActive) {
        const interlocutor = UserInfo.getUserInfoCompany().id === newChat.company_one
          ? newChat.company_two
          : newChat.company_one;
        runInAction(() => {
          this.activeChat.interlocutor = interlocutor;
          this.activeChat.id = newChat.id;
          this.activeChat.name = newChat.dialog_name;
        });
      } else this.unshiftNewChat(newChat);
    } catch (error) {
      runInAction(() => {
        this.chatsListError = error.message;
      });
    } finally {
      runInAction(() => {
        this.isChatsLoading = false;
      });
    }
  };

  @action loadMessagesHistory = async (url) => {
    this.isMessagesLoading = true;

    try {
      const newMessagesList = await axiosAuthorizedRequest({
        url: url || `/api/v1/client/company_messages/?dialog=${this.activeChat.id}&limit=10&offset=0`,
      });

      runInAction(() => {
        if (newMessagesList.next) {
          const urlObject = new URL(newMessagesList.next);
          this.nextLoadMessagesUrl = `${urlObject.pathname}${urlObject.search}`;
        } else {
          this.nextLoadMessagesUrl = '';
        }

        newMessagesList.results.reverse();
        runInAction(() => {
          this.activeChatMessagesList.unshift(...newMessagesList.results);
          this.activeChatError = '';
        });
      });
    } catch (e) {
      runInAction(() => {
        this.activeChatError = e.message;
      });
    } finally {
      runInAction(() => {
        this.isMessagesLoading = false;
      });
    }
  };

  @action loadCurrentFiles = async (message) => {
    let filesIdsToSend = [];

    try {
      const requests = this.previewFilesToSend.map((file, index) =>
        axiosAuthorizedRequest({
          url: '/api/v1/client/company_messages/upload_file/',
          method: 'POST',
          data: this.previewFilesToSend[index].file,
        }).then(
          ({ id: fileId }) => fileId,
          error => this.set('loadFilesError', `При загрузке одного из файлов произошла ошибка: ${error.response?.data?.file}`),
        ));

      if (this.loadFilesError.length === 0) {
        filesIdsToSend = await Promise.all(requests);

        if (filesIdsToSend.every((item) => !!item)) {
          runInAction(() => {
            this.webSocketConnector.send({
              send_to: this.activeChat.interlocutor,
              user_message: true,
              files: filesIdsToSend,
              message,
            });
            this.previewFilesToSend = [];
          });
        }
      }
    } catch (e) {
      runInAction(() => { this.loadFilesError = 'Проблема при загрузке некоторых вложений'; });
    } finally {
      runInAction(() => { this.isFilesLoading = false; });
    }
  }

  @action loadReadedMessages = async (id) => {
    try {
      await axiosAuthorizedRequest({
        url: `/api/v1/client/company_dialogs/${id}/reading_message/`,
        method: 'POST',
      });
    } catch (e) {
      runInAction(() => {
        this.activeChatError = e.message;
      });
    }
  }

  @action loadAllChatsUnreadCount = async () => {
    try {
      const unreadCount = await axiosAuthorizedRequest({
        url: '/api/v1/client/company_dialogs/unread_message_count/',
      });

      runInAction(() => {
        this.allChatsUnreadCount = unreadCount.count;
      });
    } catch (e) {
      runInAction(() => {
        this.activeChatError = e.message;
      });
    }
  }

  @action loadSearchChat = async (companyId = null, companyName = '') => {
    try {
      const newDialog = await axiosAuthorizedRequest({
        method: 'POST',
        url: '/api/v1/client/company_dialogs/search_dialog/',
        data: { company: companyId },
      });

      if (newDialog.id) {
        runInAction(() => {
          this.activeChat.interlocutor = companyId;
          this.activeChat.id = newDialog.id;
          this.activeChat.name = newDialog.dialog_name;
        });

        navigate(`${TINDER_URL}chats/${this.activeChat.id}`);
      }
    } catch (e) {
      const errorData = e?.response?.data || {};

      if (errorData?.detail === 'Dialog not found') {
        runInAction(() => {
          this.activeChat.interlocutor = companyId;
          this.activeChat.id = 'new';
          this.activeChat.name = companyName;
        });

        navigate(`${TINDER_URL}chats/${this.activeChat.id}`);
      } else {
        runInAction(() => {
          this.activeChatError = e.message;
        });
      }
    }
  }
}

const tinderChatStore = new TinderChat();

export default tinderChatStore;
