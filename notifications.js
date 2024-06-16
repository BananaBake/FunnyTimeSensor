async function requestNotifPermission() {
  
  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return true;
}

async function showNotification(title, icon, body, onclick, oncancel, mustclick, timeout) {
  if (await requestNotifPermission()) {
    const notification = await navigator.serviceWorker.ready.then(registration => {
      return registration.showNotification(title, {
        icon: icon,
        body: body
      });
    });
    notification.onclick = onclick;
    notification.onclose = oncancel;
    if (mustclick) {
      notification.onclose = () => {
        if (notification.closed && !notification.click) {
          showNotification(title, icon, body, onclick, oncancel, mustclick, timeout);
        }
      };
    }
    if (timeout) {
      setTimeout(() => {
        notification.close();
      }, timeout);
    }
  }
}

showNotification("Funny time", "", "Now!", "", ""," true", 6000);