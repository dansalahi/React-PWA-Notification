import React, { useEffect } from 'react';
import './App.css';

const App = () => {

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      console.log('Service worker does not support');
      return;
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      console.log('Push manager is not in the window');
      return;
    }

    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = () => {
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
    } else if (Notification.permission === 'denied') {
      // console.log('Notification permission denied');
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub) {
            console.log('User is subscribed');
          } else {
            console.log('User is not subscribed');
          }
        })
      })
    }
  };

  const askPermission = () => {
    return new Promise(function (resolve, reject) {
      // Remove any existing push subscription.
      if (navigator.serviceWorker && 'PushManager' in window) {
        navigator.serviceWorker.ready
          .then(function (registration) {
            registration.pushManager.getSubscription()
              .then(function (subscription) {
                if (subscription) {
                  subscription.unsubscribe()
                    .then(function (successful) {
                      if (successful) {
                        console.log('Existing push subscription unsubscribed');
                      } else {
                        console.log('Failed to unsubscribe existing push subscription');
                      }
                    })
                    .catch(function (error) {
                      console.error('Error unsubscribing existing push subscription:', error);
                    });
                }
              })
              .catch(function (error) {
                console.error('Error getting push subscription:', error);
              });
          });
      }

      // Request notification permission.
      const permissionResult = Notification.requestPermission(function (result) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      if (permissionResult !== 'granted') {
        // throw new Error("We weren't granted permission.");
        console.log("We weren't granted permission.")
        navigator.serviceWorker.ready.then(reg => {
          reg.pushManager.getSubscription().then(sub => {
            if (sub) {
              console.log('User is subscribed');
            } else {
              console.log('User is not subscribed');
            }
          })
        })
      }
    });
  };

  const getNotificationHandler = () => {
    askPermission().then((value) => {
      console.log('Notification permission result:', value);
    }).catch((error) => {
      console.log('Error requesting notification permission:', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getNotificationHandler}>Request Notification Permission</button>
      </header>
    </div>
  );
};

export default App;
