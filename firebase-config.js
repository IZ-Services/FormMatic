import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD4_9aaYDpFTM0V83awj5wr1XnYFKzfBug',
  authDomain: 'izservices-auth.firebaseapp.com',
  projectId: 'izservices-auth',
  storageBucket: 'izservices-auth.appspot.com',
  messagingSenderId: '473033450032',
  appId: '1:473033450032:web:fabd052b3d961d4df0c3f5',
};

const app = initializeApp(firebaseConfig);

export default app;
