import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';global.TextEncoder = TextEncoder;global.fetch = jest.fn();Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: 'http://localhost/',
    origin: 'http://localhost',
    pathname: '/',
    search: '',
    hash: '',
  },
});jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(() => ({})),
    getApps: jest.fn(() => []),
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(() => ({
      currentUser: null,
      onAuthStateChanged: jest.fn(),
      signInWithEmailAndPassword: jest.fn(),
      signOut: jest.fn(),
      setPersistence: jest.fn(),
      browserLocalPersistence: {},
    })),
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    setPersistence: jest.fn(),
    browserLocalPersistence: {},
    deleteUser: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn(),
    onSnapshot: jest.fn(),
    deleteDoc: jest.fn(),
  };
});

jest.mock('firebase/functions', () => {
  return {
    getFunctions: jest.fn(() => ({})),
    httpsCallable: jest.fn(),
  };
});jest.mock('firebase/storage', () => {
  return {
    getStorage: jest.fn(() => ({})),
  };
});jest.mock('axios', () => {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  };
});