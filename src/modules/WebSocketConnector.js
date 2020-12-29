import { getRndRange } from 'utils/fn';

const PING_TO_SUPPORT_CONNECTION_INTERVAL = 1000 * 60 * 3;
const RECONNECT_ATTEMPS = 7;

export class WebsocketConnector {
  constructor({ url, protocols, logName, onMessage, onOpen, onError, onClose, onInit, onPreReconnect, onReconnectLimitReached }) {
    this.url = url;
    this.protocols = protocols;

    this.webSocket = null;
    this.webSocketIsOpened = false;
    this.pingPongIntervalId = null;
    this.nextReconnectTimerId = null;
    this.attempsToConnectCount = RECONNECT_ATTEMPS;
    this.isPreviouslyClosedByServer = false;
    this.consoleLogName = logName;

    this.updateCallbacks({ onMessage, onOpen, onError, onClose, onInit, onPreReconnect, onReconnectLimitReached });

    this.init();
  }

  getUrl() {
    const socketProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
    return `${socketProtocol}://${this.url}`;
  }

  checkIsPreviouslyClosedByServer() {
    return this.isPreviouslyClosedByServer;
  }

  updateCallbacks({ onMessage, onOpen, onError, onClose, onInit, onPreReconnect, onReconnectLimitReached }) {
    this.onMessage = onMessage;
    this.onOpen = onOpen;
    this.onError = onError;
    this.onClose = onClose;
    this.onInit = onInit;
    this.onPreReconnect = onPreReconnect;
    this.onReconnectLimitReached = onReconnectLimitReached;
  }

  // eslint-disable-next-line consistent-return
  connectHandlers() {
    if (!this.webSocket) {
      return null;
    }

    this.webSocket.onopen = (event) => {
      this.webSocketIsOpened = true;

      this.onOpen(event); /* user callback */
    };

    this.webSocket.onclose = (event) => {
      console.info(`${this.consoleLogName}: Websocket onclose with status ${event.code}`, event);

      this.webSocketIsOpened = false;

      this.onClose(event); /* user callback */

      /* in this status back-end close websocket manually (example: if chat with manager completed) */
      if (event.code === 1000) {
        console.info(`${this.consoleLogName}: close websocket manually by server, reset connect attemps to ${RECONNECT_ATTEMPS}`);
        this.attempsToConnectCount = RECONNECT_ATTEMPS;
        this.isPreviouslyClosedByServer = true;
      } else {
        this.runReconnectCycles();
      }
    };

    this.webSocket.onerror = (event) => {
      console.error(`${this.consoleLogName}: Websocket onerror`, event);

      if (this.onError) {
        this.onError(event); /* user callback */
      }

      if (!this.webSocketIsOpened) {
        console.info(`${this.consoleLogName}: This error happened for not opened websocket`, event);

        this.closeWebsocket();
      }
    };

    this.webSocket.onmessage = event => {
      const parsedData = JSON.parse(event.data);

      // pong is detector for supporting test connection
      if (!parsedData.pong) {
        this.onMessage(parsedData); /* user callback */
      }
    };
  }

  runReconnectCycles() {
    if (!this.nextReconnectTimerId) {
      if (this.attempsToConnectCount > 0) {
        const reconnectTime = getRndRange(5000, 10000);
        this.attempsToConnectCount -= 1;

        console.info(`${this.consoleLogName}: Trying reconnect after ${reconnectTime} millisecond. Attemp ${RECONNECT_ATTEMPS - this.attempsToConnectCount}/${RECONNECT_ATTEMPS}`);

        this.onPreReconnect();

        this.nextReconnectTimerId = setTimeout(() => {
          console.info(`${this.consoleLogName}: Init websocket again for reconnecting`);

          this.nextReconnectTimerId = null;
          this.init();
        }, reconnectTime);
      } else {
        console.info(`${this.consoleLogName}: limit for reconnection attemps. Please refresh page to repeat`);
        this.onReconnectLimitReached();
      }
    }
  }

  initPingPongWorker() {
    this.pingPongIntervalId = setInterval(() => {
      this.webSocket.send(JSON.stringify({ ping: 1 }));
    }, PING_TO_SUPPORT_CONNECTION_INTERVAL);
  }

  closeWebsocket() {
    console.info(`${this.consoleLogName}: close websocket manually by client`);

    this.webSocket.close(3000, `${this.consoleLogName}: manually close websocket by client`);
    this.webSocketIsOpened = false;

    clearInterval(this.pingPongIntervalId);
    clearTimeout(this.nextReconnectTimerId);
  }

  init() {
    this.isPreviouslyClosedByServer = false;

    try {
      this.webSocket = new WebSocket(this.getUrl(), this.protocols);
    } catch (e) {
      console.error('Init websocket error,', e);
    }

    this.connectHandlers();
    this.initPingPongWorker();

    this.onInit(); /* user callback */
  }

  send(data) {
    this.webSocket.send(JSON.stringify(data));
  }
}
