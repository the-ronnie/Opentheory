'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../services/store';
import { UserProvider } from './UserProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <UserProvider>
        {children}
      </UserProvider>
    </Provider>
  );
}
