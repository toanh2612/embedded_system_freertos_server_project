const publicVapidKey = 'BM5E3zfWGPQGDIAnic0QovnUCyF1EJsxbwUgS2rnnRqRDjQa1mO5CvHvOzr6BGonQ2RUV_U2ffxKKxgnpB2OT4I';

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  // run().catch(error => console.log(error));
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function pushNotification() {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
  register('/js/worker.js');
  console.log('Registered service worker');

  console.log('Registering push');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // The `urlBase64ToUint8Array()` function is the same as in
    // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('Registered push');

  console.log('Sending push');
  console.log(JSON.stringify(subscription));
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      "Service-Worker-Allowed":"*",
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}
