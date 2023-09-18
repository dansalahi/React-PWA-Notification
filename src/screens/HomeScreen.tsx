import { FC, useEffect, useState } from "react";
import { Modal } from "components/modal";
import { BellIcon } from '@heroicons/react/24/solid'

export const HomeScreen :FC = () => {

  const [isOpenModal, setIsOpenModal] = useState(false)

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
    setIsOpenModal(false)
    askPermission().then((value) => {
      console.log('Notification permission result:', value);
    }).catch((error) => {
      console.log('Error requesting notification permission:', error);
    });
  };



  const showModal = () => { 
    setIsOpenModal(true)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-5">
        <button className='btn btn-primary' onClick={getNotificationHandler}>Request Notification Permission</button>
        <button className="btn btn-info" onClick={showModal}>Show Modal</button>

        <Modal isOpen={isOpenModal} onClose={() => { setIsOpenModal(false) }}>
        <div className="flex flex-col items-center justify-between w-3/5 px-4 py-5 bg-white rounded-md min-h-[25vh] min-w-[80vw]">
          <BellIcon className="w-8 h-8 text-blue-500" />
          <h2 className="text-lg font-semibold">Do you want to recive notifications from my company?</h2>
          <hr className="w-full h-px border-gray-100 border-1" />
          <div className="flex items-center justify-between w-full">
              <button className="btn btn-sm btn-primary" onClick={getNotificationHandler}>Yes, I do!</button>
              <button className="btn btn-sm btn-error" onClick={() => setIsOpenModal(false) }>No</button>
          </div>
        </div>
        </Modal>
    </div>
  )
}