'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
