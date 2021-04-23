import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import routes from './routes';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>{routes()}</React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
const config = {
  onUpdate: (registration: ServiceWorkerRegistration) => {
    const title = 'Simple Podcast Listener';
    const options = {
      body: 'Application was updated please close it and open it again',
      icon: "logo64.png",

    };
    registration.showNotification(title, options);
  }
}
serviceWorkerRegistration.register(config);

const getNotificationPermission = () => {
  try {
    Notification.requestPermission().then();
  } catch (e) {}
};
getNotificationPermission();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
