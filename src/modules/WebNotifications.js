import beelineLogo from 'images/beeline-logo.png';

const isSupportNotifications = 'Notification' in window;

function checkNotificationPromise() {
  try {
    Notification.requestPermission().then();
  } catch (e) {
    return false;
  }

  return true;
}

/* checks and requests permissions and controls visibility change to show notification */
class WebNotifications {
  constructor() {
    this.notifications = [];

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // The tab has become visible so clear the now-stale Notification.
      this.notifications.forEach(not => not.close());
    }
  }

  handlePermission = (permission) => {
    if (!('permission' in Notification)) {
      Notification.permission = permission;
    }

    this.pushNotificationIfAllowed('Уведомления включены.', {
      body: 'Отлично! Теперь мы сможем уведомлять вас о новых сообщениях в чате.',
      icon: beelineLogo,
    }, true);
  };

  checkAndRequestPermissions() {
    if (!isSupportNotifications) {
      console.info("This browser don't support notifications");
    } else if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then(this.handlePermission);
      } else {
        Notification.requestPermission(this.handlePermission);
      }
    }
  }

  pushNotificationIfAllowed(title, params, isIgnoreVisibility) {
    if (isSupportNotifications && Notification.permission === 'granted') {
      if (isIgnoreVisibility) {
        new Notification(title, params);
      } else if (document.visibilityState !== 'visible') {
        this.notifications.push(new Notification(title, params));
      }
    }
  }
}

export default new WebNotifications();
